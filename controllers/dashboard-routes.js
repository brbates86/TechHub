const router = require('express').Router();
const sequelize = require('../config/connnection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'created_at',
            'post_content'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                }
            },
            {
                model: User,
                attributes: ['username', 'twitter', 'github']

            }
        ]
    })
            .then(dbPostData => {
                // serialize data before passing to template
                const posts = dbPostData.map(post => post.get({ plain: true }));
                res.render('dashboard', { posts, loggedIn: true });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
          });

          router.get('/edit/:id', withAuth, (req, res) => {
            Post.findOne({
              where: {
                id: req.params.id
              },
              attributes: [
                'id',
                'title',
                'created_at',
                'post_content'
              ],
              include: [
                {
                  model: Comment,
                  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                  include: {
                    model: User,
                    attributes: ['username', 'twitter', 'github']
                  }
                },
                {
                  model: User,
                  attributes: ['username', 'twitter', 'github']
                }
              ]
            })
              .then(dbPostData => {
                if (!dbPostData) {
                  res.status(404).json({ message: 'No post found with this id' });
                  return;
                }
          
                // serialize the data
                const post = dbPostData.get({ plain: true });
        
                res.render('edit-post', {
                    post,
                    loggedIn: true
                    });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
        });
