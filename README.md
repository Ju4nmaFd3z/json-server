# CRUD Clientes y Pedidos

Ejercicio de TypeScript con JSON-Server. CRUD completo sobre dos tablas con relación 1:M: un cliente tiene muchos pedidos (clave foránea `clienteId`).

## Cómo ejecutarlo

```bash
npm install
npm run api   # terminal 1: JSON-Server en http://localhost:3000
npm run dev   # terminal 2: la web (Vite)
```

Los cambios que hagas en la web se guardan en `db.json`.

## Estructura

- `db.json`: los datos (`clientes` y `pedidos`).
- `index.html`: tablas y formularios.
- `src/api.ts`: las peticiones a JSON-Server (`GET`, `POST`, `PUT`, `DELETE`).
- `src/main.ts`: dibuja las tablas y conecta los botones y formularios.

## Funcionalidad

- Ver, crear, editar y borrar clientes.
- "Ver pedidos" muestra los pedidos de un cliente, que también se pueden crear, editar y borrar.
- Al borrar un cliente se borran también sus pedidos (`?_dependent=pedidos`).
