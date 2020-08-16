export var Tour = (function () {
  function Tour(graphA) {
    this._graphA = graphA;
    this._tour = [];
  }

  Tour.prototype.size = function () {
    return this._tour.length;
  };

  Tour.prototype.contains = function (noeudA) {
    for (var tourIndex in this._tour) {
      if (noeudA.isEqual(this._tour[tourIndex])) {
        return true;
      }
    }

    return false;
  };

  Tour.prototype.addNoeudA = function (noeudA) {
    this._tour.push(noeudA);
  };

  Tour.prototype.getNoeudA = function (tourIndex) {
    return this._tour[tourIndex];
  };

  return Tour;
})();

export var AntColony = (function () {
  function AntColony(params, g, gA) {
    this._graph = g;
    this._graphA = gA;

    this._colony = [];

    this._colonySize = 5;
    this._alpha = 1;
    this._beta = 3;
    this._rho = 0.1;
    this._initPheromone = 1;
    this._maxIterations = 1;

    this.setParams(params);

    this._iteration = 0;

    this._tab = [];

    this._iterationBest = null;
    this._globalBest = null;

    this._createAnts();
  }

  AntColony.prototype.getGraph = function () {
    return this._graph;
  };
  AntColony.prototype.setGraph = function (g) {
    this._graph = g;
  };
  AntColony.prototype.getGraphA = function () {
    return this._graphA;
  };
  AntColony.prototype.setGraphA = function (gA) {
    this._graphA = gA;
  };

  AntColony.prototype.getColony = function () {
    return this._colony;
  };
  AntColony.prototype.size = function () {
    return this._colonySize;
  };
  AntColony.prototype.currentIteration = function () {
    return this._iteration;
  };
  AntColony.prototype.getMaxIterations = function () {
    return this._maxIterations;
  };
  AntColony.prototype.getiterationBest = function () {
    return this._iterationBest;
  };
  AntColony.prototype.getGlobalBest = function () {
    return this._globalBest;
  };
  AntColony.prototype.getTab = function () {
    return this._tab;
  };
  AntColony.prototype.getTabLigne = function (i) {
    return this._tab[i];
  };

  AntColony.prototype._createAnts = function () {
    this._colony = [];
    for (var antIndex = 0; antIndex < this._colonySize; antIndex++) {
      this._colony.push(
        new Ant(this._graph, this._graphA, {
          alpha: this._alpha,
          beta: this._beta,
          rho: this._rho,
        })
      );
    }
  };

  AntColony.prototype.setParams = function (params) {
    if (params != undefined) {
      if (params.colonySize != undefined) {
        this._colonySize = params.colonySize;
      }
      if (params.alpha != undefined) {
        this._alpha = params.alpha;
      }
      if (params.beta != undefined) {
        this._beta = params.beta;
      }
      if (params.rho != undefined) {
        this._rho = params.rho;
      }
      if (params.iteration != undefined) {
        this._maxIterations = params.iteration;
      }
      if (params.initPheromone != undefined) {
        this._initPheromone = params.initPheromone;
      }
    }
  };

  AntColony.prototype.reset = function () {
    this._iteration = 0;
    this._globalBest = null;
    this.resetAnts();
    this.setInitialPheromone(this._initPheromone);
    this._graph.resetPheromone();
  };

  AntColony.prototype.setInitialPheromone = function () {
    var edges = this._graph.getEdges();
    for (var edgeIndex in edges) {
      edges[edgeIndex].setInitialPheromone(this._initPheromone);
    }
  };

  AntColony.prototype.resetAnts = function () {
    this._createAnts();
    this._iterationBest = null;
  };

  AntColony.prototype.ready = function () {
    if (this._graph.size() <= 1) {
      return false;
    }
    return true;
  };

  AntColony.prototype.run = function () {
    if (!this.ready()) {
      return;
    }

    this._iteration = 0;
    while (this._iteration < this._maxIterations) {
      this.step();
    }
  };

  AntColony.prototype.algo = function () {
    var T_arc = this._graph.getTarc();
    var nbArc =
      2 *
      this._graph.getDimension() *
      Math.pow(this._graph.getBase(), this._graph.getDimension());
    var tabEuler;
    for (var t = 0; t < this._maxIterations; t++) {
      //pour chaque génération de fourmis
      tabEuler = this._graphA.cycleEuler();
      console.log("nb-arc= " + tabEuler.length);
      console.log("colony size = " + this._colonySize);
      this._createAnts();
      this._iterationBest = null;
      for (var n = 0; n < this._colonySize; n++) {
        //pour chaque fourmi
        console.log("fourmis num  " + n);
        //initialisation des colonnes 2 et 3 de T_arc
        for (var i = 0; i < nbArc; i++) {
          T_arc[i][2] = new Array();
          T_arc[i][3] = new Array();
        }
        this._colony[n].run(T_arc, tabEuler);
        //dépot de la phéromone
        this._colony[n].addPheromone();
        console.log(
          "la solution construise par la fourmis " +
            n +
            " a une longueur de " +
            this._colony[n].getTour().length
        );
      }
      this.getGlobalBest();
      //mise à jours de la phéromone
      for (var k = 0; k < this._graphA.getEdges().length; k++) {
        this._graphA
          .getEdges()
          [k].setPheromone(
            this._graphA.getEdges()[k].getPheromoneAvant() * this._rho +
              this._graphA.getEdges()[k].getPheromone() -
              this._graphA.getEdges()[k].getPheromoneAvant()
          );
        this._graphA
          .getEdges()
          [k].setPheromoneAvant(this._graphA.getEdges()[k].getPheromone());
      }
    }
  };

  AntColony.prototype.getIterationBest = function () {
    if (this._colony[0].getTour() == null) {
      return null;
    }

    if (this._iterationBest == null) {
      var best = this._colony[0];

      for (var antIndex in this._colony) {
        if (best.getTour().length < this._colony[antIndex].getTour().length) {
          best = this._colony[antIndex];
        }
      }
      this._iterationBest = best;
    }

    return this._iterationBest;
  };

  AntColony.prototype.getGlobalBest = function () {
    var bestAnt = this.getIterationBest();
    if (bestAnt == null && this._globalBest == null) {
      return null;
    }

    if (bestAnt != null) {
      if (
        this._globalBest == null ||
        this._globalBest.getTour().length <= bestAnt.getTour().length
      ) {
        this._globalBest = bestAnt;
      }
    }

    return this._globalBest;
  };

  return AntColony;
})();

export var Ant = (function () {
  function Ant(graph, graphA, params) {
    this._graph = graph;
    this._graphA = graphA;
    this._alpha = params.alpha;
    this._beta = params.beta;
    this._rho = params.rho;
    this._tour = [];
  }

  Ant.prototype.reset = function () {
    this._tour = null;
  };

  Ant.prototype.getTour = function () {
    return this._tour;
  };

  Ant.prototype.calculProba = function (arc, tabEuler, sens) {
    var Tproba = [];
    var indice = 0;
    var edgetabeuler;
    var cumul = 0;
    var edge;
    var index;
    var ind;
    var heurist = 0.0;
    var max;
    var indMax;

    var tailleEuler = tabEuler.length;
    if (sens == 1) {
      index = this._graphA.getIndiceEuler(tabEuler, arc.getId());

      for (var k = 1; k <= tabEuler.length; k++) {
        index++;
        ind = index % tailleEuler;
        edge = this._graphA.getEdges()[tabEuler[ind]];
        if (edge.getVisite() == 0) {
          Tproba[indice] = new Array();
          Tproba[indice].push(edge.getId());
          Tproba[indice].push(1 / k);

          cumul =
            cumul +
            Math.pow(Tproba[indice][1], this._beta) *
              Math.pow(
                this._graphA.getEdges()[Tproba[indice][0]].getPheromone(),
                this._alpha
              );

          indice++;
        }
      }

      max = 0.0;
      for (var k = 0; k < Tproba.length; k++) {
        Tproba[k].push(
          (Math.pow(Tproba[k][1], this._beta) *
            Math.pow(
              this._graphA.getEdges()[Tproba[k][0]].getPheromone(),
              this._alpha
            )) /
            cumul
        );
        if (max < Tproba[k][2]) {
          max = Tproba[k][2];
          indMax = Tproba[k][0];
        }
      }
    } else if (sens == -1) {
      edgetabeuler = this._graphA.findEdge(arc.getDest(), arc.getSrc());

      index = this._graphA.getIndiceEuler(tabEuler, edgetabeuler.getId());

      for (var k = 1; k <= tabEuler.length; k++) {
        index--;
        ind = index % tailleEuler;

        if (index == -1) {
          index = tabEuler.length - 1;
        }
        edge = this._graphA.getEdges()[tabEuler[index]];
        edge = this._graphA.findEdge(edge.getDest(), edge.getSrc());

        if (edge.getVisite() == 0) {
          Tproba[indice] = new Array();
          Tproba[indice].push(edge.getId());
          Tproba[indice].push((1.0 / k) * tabEuler.length * 2);

          cumul =
            cumul +
            Math.pow(Tproba[indice][1], this._beta) *
              Math.pow(
                this._graphA.getEdges()[Tproba[indice][0]].getPheromone(),
                this._alpha
              );

          indice++;
        }
      }

      max = 0.0;
      var info = 0.0;
      var ph = 0.0;
      var res = 0.0;
      for (var k = 0; k < Tproba.length; k++) {
        info = Math.pow(Tproba[k][1], this._beta);
        ph = Math.pow(
          this._graphA.getEdges()[Tproba[k][0]].getPheromone(),
          this._alpha
        );
        res = (info * ph) / cumul;
        Tproba[k].push(res);
        if (max < Tproba[k][2]) {
          max = Tproba[k][2];
          indMax = Tproba[k][0];
        }
      }
    }

    return indMax;
  };

  Ant.prototype.run = function (T_arc, tabEuler) {
    var r;
    var arc;
    var index;
    var tour = [];
    //console.log("-------------sens direct------------");
    r = Math.floor(Math.random() * (tabEuler.length - 1));
    //console.log("l'indice choisi est "+r);
    arc = this._graphA.getEdges()[tabEuler[r]];
    this._graphA.getEdges()[arc.getId()].setVisite(1);
    //remplir les deux colonnes des pères et fils de arc dans T_arc
    T_arc = this._graphA.setPeresFils(tour, arc, T_arc);
    //parcours des arcs dans un seul sens
    for (var l = 0; l < this._graphA.getEdges().length / 2 - 1; l++) {
      // calcule de proba pour choisir le prochain saut
      arc = this._graphA.getEdges()[this.calculProba(arc, tabEuler, 1)];
      this._graphA.getEdges()[arc.getId()].setVisite(1);
      T_arc = this._graphA.setPeresFils(tour, arc, T_arc); //rajout à la solution inclu, si pas de cycle
    }
    //console.log("-------------sens inverse------------");
    arc = this._graphA.findEdge(arc.getDest(), arc.getSrc());
    T_arc = this._graphA.setPeresFils(tour, arc, T_arc);
    this._graphA.getEdges()[arc.getId()].setVisite(1);
    //parcours des arcs dans le sens inverse
    for (var l = 0; l < this._graphA.getEdges().length / 2 - 1; l++) {
      // calcule de proba pour choisir le prochain saut
      arc = this._graphA.getEdges()[this.calculProba(arc, tabEuler, -1)];
      this._graphA.getEdges()[arc.getId()].setVisite(1);
      T_arc = this._graphA.setPeresFils(tour, arc, T_arc); //rajout à la solution inclu, si pas de cycle
    }

    this._tour = tour;
    //réinitialiser le champs visité des arcs à 'non visité'
    this._graphA.resetVisite();
  };

  Ant.prototype.addPheromone = function () {
    var ph;
    for (var index in this._tour) {
      this._graphA
        .getEdges()
        [this._tour[index].getId()].addPheromone(Math.sqrt(this._tour.length));
    }
  };
  return Ant;
})();

// $(document).ready(function () {
//   window.ac = null;
//   $("#Start").click(function () {
//     window.ac = new AntColony(window.params, window.G, window.Gadj);
//     ac.algo();
//     console.log("longueur de la sol ACO =" + ac._globalBest.getTour().length);
//     console.log("");
//     heuristique = new EulerHeuristic(G, Gadj);
//     heuristique.run();
//     console.log("-----------Evaluation - niv 1---------");
//     var niv = 1;
//     var evaluation = new Eval(G, heuristique.getTour(), niv);
//     evaluation.addACOsol(ac._globalBest.getTour());
//     evaluation.calculTableRoutage();
//     evaluation.run(2);

//     console.log(
//       "métrique pour ACO niv 1 est =" + evaluation._metriqueACO + "%"
//     );
//     var seuille = $("#seuille").val();
//     while (evaluation._metriqueACO < seuille) {
//       console.log("Seuille non atteint");
//       console.log("Passage au niveau suivant");
//       niv++;
//       console.log("-----------Evaluation - niv " + niv + "---------");
//       var evaluation = new Eval(G, heuristique.getTour(), niv);
//       evaluation.addACOsol(ac._globalBest.getTour());
//       evaluation.calculTableRoutage();
//       evaluation.run(2);
//       console.log(
//         "métrique pour ACO niv " +
//           niv +
//           " est =" +
//           evaluation._metriqueACO +
//           "%"
//       );
//     }
//     console.log("Seuille atteint");
//     console.log("");
//     console.log(
//       "Résultat : Seuille atteint avec ACO au niveau " +
//         niv +
//         " avec une métrique = " +
//         evaluation._metriqueACO +
//         "%"
//     );
//     console.log("");
//   });
// });
