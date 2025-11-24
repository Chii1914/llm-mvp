Promps:

-- Usando copilot y gemini -- 

Hola gemini! Necesito que me proveas un Docker composer para poder usar mi backend en un trabajo, necesito levantar una base de datos mongodb y otra mysql, porfavor, debe persistir la data de ambas Bd's

-- comando para usar esto --

> docker compose up -d --force-recreate

Necesito que dado el siguiente contexto me hagas una base de datos mysql porfavor, luego manteniendo ese contexto me ayudarás con mi integración en nestjs porfavor, cuando te lo pida eventualmente

Necesito que ahora te conviertas en un experto en ingeniería de software y modifiques el Docker composer para añadir el motor ngix para hacer los reverse proxy

Perfect, we are working in ms-nosql-ecommerce, first, please add a .env and on the app.module.ts replace the import uri with the .env import, secondly, i creeated with nestjs cli the folder products, i need to integrade my mysql database, could you please do that on the schema for products ?

using the entity that i created, please implement the controller and service, i need a get to get all products and another endpoint to "buy" a product, i let to you the logic 

perfect, now i need a locuts file example 

please integrate a deletion of some products and the update on other products on the locustfile, to test all the api please

-- comando para usar esto --

> locust -f locustfile.py --host=http://localhost:3000 --

now in top level of the folders i mean /locust i wanna create a nextjs frontend, basic, must have 2 pages, one to use the get products and buy them, and another page to the administrator i mean, modify products, delete and post more of them. use boostrap please, and isolate the url for the api 

finally i need you to please isolate a mysql and a nosql front end, just let a page to select where to use the backend either the mysql one or the nosql one, let the nosql one that we have been working together, the mysql let empty for now with a message that says "tu turno tiano". And finnally translate all the frontend into spanish please