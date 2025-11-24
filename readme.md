Promps:

Hola gemini! Necesito que me proveas un Docker composer para poder usar mi backend en un trabajo, necesito levantar una base de datos mongodb y otra mysql, porfavor, debe persistir la data de ambas Bd's

-- comando para usar esto --

> docker compose up -d --force-recreate

Necesito que dado el siguiente contexto me hagas una base de datos mysql porfavor, luego manteniendo ese contexto me ayudarás con mi integración en nestjs porfavor, cuando te lo pida eventualmente

Necesito que ahora te conviertas en un experto en ingeniería de software y modifiques el Docker composer para añadir el motor ngix para hacer los reverse proxy

Perfect, we are working in ms-nosql-ecommerce, first, please add a .env and on the app.module.ts replace the import uri with the .env import, secondly, i creeated with nestjs cli the folder products, i need to integrade my mysql database, could you please do that on the schema for products ?

using the entity that i created, please implement the controller and service, i need a get to get all products and another endpoint to "buy" a product, i let to you the logic 