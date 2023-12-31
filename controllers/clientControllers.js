// aqui requiero el mongo para interactuar con la base de datos
const { client, ObjectId } = require("../database/conexion");

const administradores = ["miltoncoria03@gmail.com"];

// Aqui renderizo la pagina de ayuda al entrar en el enlace /cleint
const pageClient = async (req, res) => {
    const pageTitle = "Bienvenido Cliente - Cabañas Bello Atardecer";

    res.render("client", {
        title: pageTitle,
        showFooter: true,
    });
};

const guardarDatosClient = async (req, res) => {
    const datos = req.body;

    const typeUser = (arrayAdmin, paramcorreo) => {
        let userAdmin;
        for (let i = 0; i < arrayAdmin.length; i++) {
            if (paramcorreo === arrayAdmin[i]) {
                userAdmin = true;
            }
        }

        let tipoUsuario = userAdmin === true ? "admin" : "client";

        return tipoUsuario;
    };

    const userUpdate =
        datos.tipo === "nombre"
            ? { $set: { nombre: datos.param } }
            : datos.tipo === "ubicacion"
            ? { $set: { ubicacion: datos.param } }
            : datos.tipo === "telefono"
            ? { $set: { telefono: datos.param } }
            : datos.tipo === "correo"
            ? {
                  $set: {
                      correo: datos.param,
                      user: typeUser(administradores, datos.param),
                  },
              }
            : "";

    const db = client.db("users").collection("cuentas");

    const update = await db.updateOne({ _id: ObjectId(datos.id) }, userUpdate);

    const userResponse = await db.findOne({ _id: ObjectId(datos.id) });

    res.json(userResponse);
};

// exportando como modulo pageClient para que la ruta /client lo reciba en el archivo clientRoutes
module.exports = { pageClient, guardarDatosClient };
