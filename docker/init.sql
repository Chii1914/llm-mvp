-- Grant all privileges to user on tienda_demo database
GRANT ALL PRIVILEGES ON tienda_demo.* TO 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON tienda_demo.* TO 'user'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
