import { serverRender } from "./serverRender";
import fetch from "isomorphic-fetch";
import { MongoClient } from "mongodb";
import { findAllTutor } from "./api";

module.exports = {
  name: "myPlugin",
  version: "1.0.0",
  register: async function(server, options) {
    // Main Page
    server.route({
      method: "GET",
      path: "/",
      handler: function(request, h) {
        const { cssData, htmlData, initialState } = serverRender(request, {
          count: 100
        });
        return h.view("index", {
          pageTitle: "home",
          cssData,
          htmlData,
          initialState
        });
      }
    });

    // BrowseTutor
    server.route({
      method: "GET",
      path: "/browse",
      handler: async (request, h) => {
        const qParam = request.query.id ? `?id=${request.query.id}` : ``;
        const uri = `http://localhost:3000/api/tutor${qParam}`;
        console.log(`uri: ${uri}`);
        // fetch from api
        const res = await fetch(uri);
        const dataObj = await res.json();

        // getting user param query (backend)
        console.log(`[Server]: ${JSON.stringify(request.query)}`);

        const state = { tutor: dataObj };
        const { cssData, htmlData, initialState } = serverRender(
          request,
          state
        );

        return h.view("index", {
          pageTitle: "Browse - Tutors",
          cssData,
          htmlData,
          initialState
        });
      }
    });

    // /api/tutor
    server.route({
      method: "GET",
      path: "/api/tutor",
      handler: async function(request, reply) {
        const _id = request.query.id
          ? { _id: parseInt(request.query.id, 10) }
          : {};
        console.log(`api/tutor _id ${JSON.stringify(_id)}`);

        const qResult = await findAllTutor(_id);
        return reply.response(qResult).code(200);
      }
    });
  }
};
