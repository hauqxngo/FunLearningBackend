-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'test@test.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'test@test.com',
        TRUE);

INSERT INTO categories (handle,
                        name,
                        description)
VALUES ('alphabet', 'Alphabet',
        'Learn ABC phonics, letters, and build vocabularies.'),
       ('numbers', 'Numbers',
        'Learn to count from 1 to 20.'),
        ('shapes', 'Shapes',
        'Learn basic shapes with examples.'),
        ('colors', 'Colors',
        'Fun way to introduce colors.');

INSERT INTO items (name, category_handle)
VALUES ('Aa', 'alphabet'),
        ('Bb', 'alphabet'),
        ('Cc', 'alphabet'),
        ('Dd', 'alphabet'),
        ('Ee', 'alphabet'),
        ('Ff', 'alphabet'),
        ('Gg', 'alphabet'),
        ('Hh', 'alphabet'),
        ('Ii', 'alphabet'),
        ('Jj', 'alphabet'),
        ('Kk', 'alphabet'),
        ('Ll', 'alphabet'),
        ('Mm', 'alphabet'),
        ('Nn', 'alphabet'),
        ('Oo', 'alphabet'),
        ('Pp', 'alphabet'),
        ('Qq', 'alphabet'),
        ('Rr', 'alphabet'),
        ('Ss', 'alphabet'),
        ('Tt', 'alphabet'),
        ('Uu', 'alphabet'),
        ('Vv', 'alphabet'),
        ('Ww', 'alphabet'),
        ('Xx', 'alphabet'),
        ('Yy', 'alphabet'),
        ('Zz', 'alphabet'),
        ('1', 'numbers'),
        ('2', 'numbers'),
        ('3', 'numbers'),
        ('4', 'numbers'),
        ('5', 'numbers'),
        ('6', 'numbers'),
        ('7', 'numbers'),
        ('8', 'numbers'),
        ('9', 'numbers'),
        ('10', 'numbers'),
        ('11', 'numbers'),
        ('12', 'numbers'),
        ('13', 'numbers'),
        ('14', 'numbers'),
        ('15', 'numbers'),
        ('16', 'numbers'),
        ('17', 'numbers'),
        ('18', 'numbers'),
        ('19', 'numbers'),
        ('20', 'numbers'),
        ('Triangle', 'shapes'),
        ('Circle', 'shapes'),
        ('Rectangle', 'shapes'),
        ('Heart', 'shapes'),
        ('Square', 'shapes'),
        ('Start', 'shapes'),
        ('Oval', 'shapes'),
        ('Diamond', 'shapes'),
        ('Hexagon', 'shapes'),
        ('Red', 'colors'),
        ('Blue', 'colors'),
        ('Green', 'colors'),
        ('Yellow', 'colors'),
        ('Purple', 'colors'),
        ('Orange', 'colors'),
        ('Brown', 'colors'),
        ('Black', 'colors'),
        ('Gray', 'colors'),
        ('Pink', 'colors'),
        ('White', 'colors');

