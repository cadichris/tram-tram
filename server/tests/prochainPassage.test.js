const { prochainPassage } = require("../prochainPassage");

describe("Prochain passage", () => {
  it("récupère les prochains passages à Gare de Blanquefort et Place Paul Doumer", async () => {
    const socket = { send: jest.fn() };

    const prochainPassageInMemory = {
      getProchainPassage: jest.fn(async () => [
        { horaire: "2021-10-23T20:57:19" },
      ]),
    };

    await prochainPassage(new Set([socket]), prochainPassageInMemory);

    expect(prochainPassageInMemory.getProchainPassage).toHaveBeenCalledWith({
      ids_arrets: ["T_BQF_A", "T_BQF_R"],
      terminus_exclus: ["Gare De Blanquefort"],
    });
    expect(prochainPassageInMemory.getProchainPassage).toHaveBeenCalledWith({
      ids_arrets: ["T_DOUMER_A"],
      terminus_exclus: ["Parc Des Expositions - Nouveau Stade"],
    });
  });

  it("envoi aux sockets le prochain passage renvoyé par l'adapter", async () => {
    const socket = { send: jest.fn() };

    const prochainPassageInMemory = {
      getProchainPassage: async () => [{ horaire: "2021-10-23T20:57:19" }],
    };

    await prochainPassage(new Set([socket]), prochainPassageInMemory);

    expect(socket.send).toHaveBeenCalledWith(
      JSON.stringify({
        gare_de_blanquefort: [{ horaire: "2021-10-23T20:57:19" }],
        place_paul_doumer: [{ horaire: "2021-10-23T20:57:19" }],
      })
    );
  });

  it("ne fait rien si la liste des sockets est vide", async () => {
    const prochainPassageInMemory = { getProchainPassage: jest.fn() };

    await prochainPassage(new Set(), prochainPassageInMemory);

    expect(prochainPassageInMemory.getProchainPassage).not.toHaveBeenCalled();
  });
});
