<?php

class Categories extends Koken_Controller {

	function __construct()
    {
         parent::__construct();
    }

	function index()
	{
		list($params, $id, $slug) = $this->parse_params(func_get_args());

		// Create or update
		if ($this->method != 'get')
		{
			$c = new Category();
			switch($this->method)
			{
				case 'post':
				case 'put':
					if ($this->method == 'put')
					{
						if (is_null($id))
						{
							$this->error('403', 'Required parameter "id" not present.');
						}
						// Update
						$c->get_by_id($id);
						if (!$c->exists())
						{
							$this->error('404', "Category with ID: $id not found.");
						}
					}

					// Don't allow these fields to be saved generically
					$private = array('albums_count', 'content_count');
					foreach($private as $p) {
						unset($_POST[$p]);
					}

					if (!$c->from_array($_POST, array(), true))
					{
						// TODO: More info
						$this->error('500', 'Save failed.');
					}
					$this->redirect("/categories/{$c->id}");
					break;
				case 'delete':
					if (is_null($id))
					{
						$this->error('403', 'Required parameter "id" not present.');
					}
					else
					{
						if (is_numeric($id))
						{
							$category = $c->get_by_id($id);
							$title = $category->title;

							if ($category->exists())
							{
								$s = new Slug;
								$this->db->query("DELETE FROM {$s->table} WHERE id = 'category.{$category->slug}'");

								if (!$category->delete())
								{
									// TODO: More info
									$this->error('500', 'Delete failed.');
								}
								$id = null;
							}
							else
							{
								$this->error('404', "Category with ID: $id not found.");
							}
						}
						else
						{
							$id = explode(',', $id);

							$c->where_in('id', $id);
							$cats = $c->get_iterated();
							foreach($cats as $c)
							{
								if ($c->exists())
								{
									$s = new Slug;
									$this->db->query("DELETE FROM {$s->table} WHERE id = 'category.{$c->slug}'");
									$c->delete();
								}
							}
						}
					}
					exit;
					break;
			}

		}
		$c = new Category();
		// No id, so we want a list
		if (is_null($id) && !$slug)
		{
			$options = array(
				'page' => 1,
				'limit' => 20,
				'order_by' => 'title',
				'order_direction' => 'asc',
				'category' => false,
				'limit_to' => false,
				'include_empty' => true
			);



			$options = array_merge($options, $params);

			if (!is_numeric($options['limit']))
			{
				$options['limit'] = false;
			}

			if (is_numeric($options['category']))
			{
				$c->where('id', $options['category']);
			}

			if ($options['order_by'] !== 'count' && strpos($options['order_by'], 'count') !== false)
			{
				if ($options['order_by'] === 'essay_count')
				{
					$options['order_by'] = 'text_count';
				}
				$c->where("{$options['order_by']} >", 0);
				if (!isset($params['order_direction']))
				{
					$options['order_direction'] = 'DESC';
				}
			}
			else if ($options['limit_to'])
			{
				$limit = str_replace('essay', 'text', rtrim($options['limit_to'], 's')) . '_count';
				$c->where("$limit >", 0);
			}
			else if (!$options['include_empty'])
			{
				$c->where('count >', 0);
			}

			$final = $c->paginate($options);

			$c->order_by("{$options['order_by']} {$options['order_direction']}");

			$data = $c->get_iterated();

			if (!$options['limit'])
			{
				$final['per_page'] = $data->result_count();
				$final['total'] = $data->result_count();
			}

			$koken_url_info = $this->config->item('koken_url_info');
			$base = $koken_url_info->base;

			$final['categories'] = array();
			foreach($data as $category)
			{
				$cat = $category->to_array($options);
				$cat['items'] = $base . 'api.php?/categories/' . $category->id;
				$final['categories'][] = $cat;
			}
		}
		// Get category by id
		else
		{
			if (!is_null($id))
			{
				$category = $c->get_by_id($id);
			}
			else if ($slug)
			{
				$category = $c->where('slug', $slug)->get();
			}

			if ($category->exists())
			{
				$options = array(
					'page' => 1,
					'limit' => 50
				);

				$options = array_merge($options, $params);

				$category_arr = $category->to_array($options);

				$options['category'] = $category->id;
				list($final, $counts) = $this->aggregate('category', $options);

				$prev = new Category;
				$next = new Category;

				$prev->where('title <', $category->title)->where('count >', 0)->order_by('title DESC, id DESC');
				$next->where('title >', $category->title)->where('count >', 0)->order_by('title ASC, id ASC');

				$max = $next->get_clone()->count();
				$min = $prev->get_clone()->count();

				$context = array(
					'total' => $max + $min + 1,
					'position' => $min + 1
				);

				$prev->limit(1)->get();
				$next->limit(1)->get();

				unset($options['category']);

				if ($prev->exists())
				{
					$context['previous'] = array( $prev->to_array($options) );
				}
				else
				{
					$context['previous'] = array();
				}

				if ($next->exists())
				{
					$context['next'] = array( $next->to_array($options) );
				}
				else
				{
					$context['next'] = array();
				}

				$final = array_merge($category_arr, $final);
				$final['counts'] = $counts;
				$final['context'] = $context;
			}
			else
			{
				$this->error('404', "Category with ID: $id not found.");
			}
		}
		$this->set_response_data($final);
	}

	function members()
	{
		list($params, $id, $slug) = $this->parse_params(func_get_args());

		$cat = new Category;
		if (isset($params['content']))
		{
			$getter = new Content;
			$model = $url_bit = 'content';
		}
		else if (isset($params['albums']))
		{
			$getter = new Album;
			$model = 'album';
			$url_bit = 'albums';
		}
		else if (isset($params['essays']))
		{
			$getter = new Text;
			$model = $url_bit = 'text';
		}

		if (is_null($id) && !$slug)
		{
			$this->error('403', 'Required parameter "id" not present.');
		}
		else if (is_array($id))
		{
			list($id, $content_id) = $id;
		}

		if (!is_null($id))
		{
			$category = $cat->get_by_id($id);
		}
		else if ($slug)
		{
			$category = $cat->get_by_slug($slug);
		}

		if (!$category->exists())
		{
			$this->error('404', 'Category not found.');
		}

		if ($this->method != 'get')
		{
			if (!isset($content_id))
			{
				$this->error('403', 'Required content id not present.');
			}
			if (strpos($content_id, ',') !== FALSE)
			{
				$ids = explode(',', $content_id);
			}
			else
			{
				$ids = array($content_id);
			}
			if (isset($params['content']))
			{
				$c = new Content;
			}
			else if (isset($params['albums']))
			{
				$c = new Album;
			}
			else
			{
				$c = new Text;
				$c->where('page_type', 0);
			}
			$members = $category->{$model . 's'}->select('id')->get_iterated();
			$member_ids = array();
			foreach($members as $member)
			{
				$member_ids[] = $member->id;
			}
			$contents = $c->where_in('id', $ids)->order_by('id ASC')->get_iterated();
			foreach($contents as $content)
			{
				if ($content->exists())
				{
					switch($this->method)
					{
						case 'post':
							if ($category->save($content))
							{
								if (!in_array($content->id, $member_ids))
								{
									$category->{$model . '_count'} += 1;
									$category->save();
								}
							}
							break;
						case 'delete':
							if (in_array($content->id, $member_ids))
							{
								$category->delete($content);
								$category->{$model . '_count'} -= 1;
								$category->save();
							}
							break;
					}
				}
			}

			if ($this->method == 'delete')
			{
				exit;
			}
			else
			{
				$this->redirect("/categories/{$category->id}/$url_bit");
			}
		}

		$params['auth'] = $this->auth;

		if ($model === 'album')
		{
			$final = $getter->listing(array_merge($params, array('category' => $category->id)));
		}
		else
		{
			$params['category'] = $category->id;
			$final = $getter->listing($params);
		}
		$final['category'] = $category->to_array();
		$this->set_response_data($final);
	}
}

/* End of file categories.php */
/* Location: ./system/application/controllers/categories.php */