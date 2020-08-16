var EulerHeuristic = (function () {
    function EulerHeuristic(graph,graphA) {
	    this._graph=graph;
        this._graphA = graphA;
		this._tour=[];
        
    }
	
	EulerHeuristic.prototype.getTour = function() {
	
	return this._tour;
	};
    EulerHeuristic.prototype.containsArc = function(id) {
	for(var ind in this._tour){
	if(this._tour[ind].getId()==id) return 1;
	}
	return 0;
	};
	
    EulerHeuristic.prototype.run = function() {
		var tabEueler=this._graphA.cycleEuler();
		var T_arc=this._graph.getTarc();
		var tour=[];
		//initialisation des deux colonnes pères et fils de T_arc
		for(var i=0;i<T_arc.length;i++){
			T_arc[i][2]=new Array();
			T_arc[i][3]=new Array();
		}
		var arc;
		//parcours dans le sens direct
		for(var ind in tabEueler){
			arc=this._graphA.getEdges()[tabEueler[ind]];
			T_arc=this._graphA.setPeresFils(tour,arc,T_arc);
		}
		//parcours dans le sens inverse
		for(var i=tabEueler.length-1;i>=0;i--){
			arc=this._graphA.getEdges()[tabEueler[i]];
			arc=this._graphA.findEdge(arc.getDest(),arc.getSrc());	
			T_arc=this._graphA.setPeresFils(tour,arc,T_arc);
		}
		//affectation de la solution
		this._tour=tour;		
    };  
  	
    return EulerHeuristic;
})(); 

var Tour = (function () {
    function Tour(graphA) {
        this._graphA = graphA;
        this._tour = [];
    }

    Tour.prototype.size = function() { return this._tour.length; };

    Tour.prototype.contains = function(noeudA) {
        for (var tourIndex in this._tour) {
            if (noeudA.isEqual(this._tour[tourIndex])) {
                return true;
            }
        }

        return false;
    };

    Tour.prototype.addNoeudA = function(noeudA) {
        this._tour.push(noeudA);
    };

    Tour.prototype.getNoeudA = function(tourIndex) {
        return this._tour[tourIndex];
    };

    return Tour;
})();

var Eval=(function(){
        function Eval(graph,solEuler,niveaux) {
        this._graph = graph;
        this._solEuler=solEuler;
		this._tabRoutage=[];
		this._niveaux=niveaux;
    }
	
	Eval.prototype.addACOsol=function(solACO){
		this._solACO = solACO;
	}
	
	
	Eval.prototype.cout=function(srce,dest){
	var cmin=0;
	var c1=0;
	var c2=0;
	var s,d;
	
	for(var i=0; i< this._graph.getDimension();i++){
	s=Math.min(srce.getCoord(i),dest.getCoord(i));
	d=Math.max(srce.getCoord(i),dest.getCoord(i));
	c1=Math.abs(srce.getCoord(i)-dest.getCoord(i));
	
	c2=(s%(this._graph.getBase()-1))+1+Math.abs((this._graph.getBase()-1)-d);
	cmin=cmin+Math.min(c1,c2);
	}
	return cmin;
	};
	
	
	
	Eval.prototype.calculTableRoutage=function(){
		var srce;
		var dest;
		var v;
		var index;
		var nbNoeuds=this._graph.getNoeuds().length;
		//initialisation de la table de routage
		for(var i=0;i<nbNoeuds;i++){
			this._tabRoutage[i]=new Array(nbNoeuds);
		}
		for(var i=0;i<nbNoeuds;i++){
			for(var j=0;j<nbNoeuds;j++){
				this._tabRoutage[i][j]=new Array();
			}
		}
		//remplissage de la table de routage avec les dépendances permises par la méthode utilisée
		for(var i=0;i<nbNoeuds;i++){
			srce=this._graph.getNoeuds()[i];
			for(var j=0;j<nbNoeuds;j++){
				dest=this._graph.getNoeuds()[j];
				if(srce.getId()!=dest.getId() && this._graph.estVoisin(srce,dest)==0){
					for(var d=0;d<this._graph.getTableVoisins()[i].length;d++){
						v=this._graph.getTableVoisins()[i][d];
						if(this.cout(srce,dest)==(1+this.cout(v,dest))){
							this._tabRoutage[i][j].push(v);
	
						}
					}
				} 
			}
		}
	};
	
	Eval.prototype.NCFT=function(srce,dest){
	var som=0;
	var v;
	if(srce.getId()==dest.getId()) return 0;
	 else {
	    if(this._graph.estVoisin(srce,dest)==1) return 1;
		else{
		    for(var d=0;d<this._tabRoutage[srce.getId()][dest.getId()].length;d++){
			v=this._tabRoutage[srce.getId()][dest.getId()][d];
			som=som+this.NCFT(v,dest);
			}
			return som;
		}
	 }
	};
	Eval.prototype.EstVoisinACO=function(entr,srce,dest){
	for(var i in this._solACO){
	if(this._solACO[i]._noeudEnt==entr.getId() && this._solACO[i]._noeudSrc==srce.getId() && this._solACO[i]._noeuddest==dest.getId()) 
	{return 1;}
	}
	return 0;
	};
	
	Eval.prototype.EstVoisinEuler=function(entr,srce,dest){
	for(var i in this._solEuler){
	if((this._solEuler[i]._noeudEnt==entr.getId() && this._solEuler[i]._noeudSrc==srce.getId() )&& this._solEuler[i]._noeuddest==dest.getId()) {
	return 1;
	}
	}
	return 0;
	};
	
	Eval.prototype.NCCMACO=function(srce,dest){
	var som=0;
	var v;
	if(srce.getId()==dest.getId()){
	return 0;
	}else{
	  if(this._graph.estVoisin(srce,dest)==1) return 1;
	  else{
	    for(var d=0;d<this._tabRoutage[srce.getId()][dest.getId()].length;d++){
			v=this._tabRoutage[srce.getId()][dest.getId()][d];
			som=som+this.NCCMACO1(1,srce,v,dest);
			}
		return som;
	  }
	}
	};
	Eval.prototype.NCCMEuler=function(srce,dest){
	var som=0;
	var v;
	if(srce.getId()==dest.getId()){
	return 0;
	}else{
	  if(this._graph.estVoisin(srce,dest)==1) return 1;
	  else{
	    for(var d=0;d<this._tabRoutage[srce.getId()][dest.getId()].length;d++){
			v=this._tabRoutage[srce.getId()][dest.getId()][d];
			som=som+this.NCCMEuler1(1,srce,v,dest);
			}
		return som;
	  }
	}
	};
	
	Eval.prototype.NCCMACO1=function(nivC,ne,s,d){
	 var som=0;
	 var v;
	if(s.getId()==d.getId()){
	return 0;
	}else{
	  if(this._graph.estVoisin(s,d)==1 && (this.EstVoisinACO(ne,s,d)==1 || nivC<this._niveaux )  ) return 1;
	  else{
	  for(var m=0;m<this._tabRoutage[s.getId()][d.getId()].length;m++){
			v=this._tabRoutage[s.getId()][d.getId()][m];
			if(this.EstVoisinACO(ne,s,v)==1)
			{
			som=som+this.NCCMACO1(nivC,s,v,d);
			}
			 else if(nivC<this._niveaux) som=som+this.NCCMACO1(nivC+1,s,v,d);
			}
			return som;
	  }
	  }
	};

	Eval.prototype.NCCMEuler1=function(nivC,ne,s,d){
	 var som=0;
	 var v;
	 if(s.getId()==d.getId()){
	return 0;
	}else{
	  if( this._graph.estVoisin(s,d)==1 && (this.EstVoisinEuler(ne,s,d)==1 || nivC<this._niveaux )  ) return 1;
	  else{
	  for(var m=0;m<this._tabRoutage[s.getId()][d.getId()].length;m++){
			v=this._tabRoutage[s.getId()][d.getId()][m];
			if(this.EstVoisinEuler(ne,s,v)==1)
			{
			
			som=som+this.NCCMEuler1(nivC,s,v,d);
			
			}
			 else if(nivC<this._niveaux) som=som+this.NCCMEuler1(nivC+1,s,v,d);
			}
			return som;
	  }
	  }
	};
	
	Eval.prototype.run=function(numEval){
		var s,d;
		var ncft;
		var aco=0.0;
		var euler=0.0;
		for(var sind in this._graph.getNoeuds()){
			s=this._graph.getNoeuds()[sind];
			for(var dind in this._graph.getNoeuds()){
				d=this._graph.getNoeuds()[dind];
				if(s.getId()!=d.getId()){
					ncft=this.NCFT(s,d);
					if (numEval==2){
						aco= aco+ (this.NCCMACO(s,d)/ncft);
					}
					euler= euler+ (this.NCCMEuler(s,d)/ncft);
				}	
			}
		}
		var nbNoeuds=this._graph.getNoeuds().length;
		if (numEval==2){
			aco=aco*100/(nbNoeuds*(nbNoeuds-1));
			this._metriqueACO=aco;
		}
		euler=euler*100/(nbNoeuds*(nbNoeuds-1));
		this._metriqueEuler=euler;
	};
	return Eval;
})();       

$(document).ready(function(){
	var heuristique=null;
	$('#euler').click(function() {
        heuristique=new EulerHeuristic(window.G,window.Gadj);
		heuristique.run();
		console.log("fin euler");
		console.log("Longueur de la solution Euler ="+heuristique.getTour().length);
		console.log("")
		console.log("-----------Evaluation - niv 1---------");
		var niv=1;
		var evaluation=new Eval(G,heuristique.getTour(),niv);
		evaluation.calculTableRoutage();
		evaluation.run(1);
		
		console.log("métrique pour Euler niv 1 est ="+evaluation._metriqueEuler+"%");	
		var seuille=$('#seuille').val();
		while (evaluation._metriqueEuler < seuille){
			console.log("Seuille non atteint");
			console.log("Passage au niveau suivant");
			niv++;
			console.log("-----------Evaluation - niv "+niv+"---------");
			var evaluation=new Eval(G,heuristique.getTour(),niv);
			evaluation.calculTableRoutage();
			evaluation.run(1);
			console.log("métrique pour Euler niv "+niv+" est ="+evaluation._metriqueEuler+"%");	
		}		
		console.log("Seuille atteint");
		console.log("")
		console.log("Résultat : Seuille atteint avec Euler au niveau "+niv+" avec une métrique = "+ evaluation._metriqueEuler+"%");
		console.log("")
				
    });
	$('#eval1').click(function() {
		var mC = prompt("Veuillez donner la métrique du cycle eulérien correspondante","métrique");
       if (heuristique==null){
			alert("Veillez lancer l'heuristique d'euler d'abord ");
		}
		else{
		var niv = prompt("Veuillez préciser le niveau de communication","niveau");
			alert("Patientez, évaluation en cours ...");
			
			console.log("")
			console.log("****Evaluation 1 : Heuristique d'Euler vs Cycle Eulérien***")
			var evaluation=new Eval(G,heuristique.getTour(),niv);
			evaluation.calculTableRoutage();
			evaluation.run(1);
			console.log("fin eval");
			console.log("métrique cycle eulérien = "+ mC +" %");
			console.log("métrique heuristique d'euler = "+ evaluation._metriqueEuler+" %");	
			if (mC > evaluation._metriqueEuler){
				alert("Avec "+niv+" niveau(x) de communication, la méthode du cycle eulérien est meilleure que celle de l'heuristique d'euler pour cette instance. L'amélioration obtenue est de "+(mC-evaluation._metriqueEuler)+ " %");
				console.log("Avec "+niv+" niveau(x) de communication, la méthode du cycle eulérien est meilleure que celle de l'heuristique d'euler pour cette instance. L'amélioration obtenue est de "+(mC-evaluation._metriqueEuler)+ " %");
			}
			else if (mC < evaluation._metriqueEuler) {
				alert("Avec "+niv+" niveau(x) de communication, la méthode de l'heuristique d'euler  est meilleure que celle du cycle eulérien pour cette instance. L'amélioration obtenue est de "+(evaluation._metriqueEuler-mC) +" %");
				console.log("Avec "+niv+" niveau(x) de communication, la méthode de l'heuristique d'euler  est meilleure que celle du cycle eulérien pour cette instance. L'amélioration obtenue est de "+(evaluation._metriqueEuler-mC) +" %");
			}
			else{
				alert("Avec "+niv+" niveau(x) de communication,, les deux méthodes donnent la mème performance pour cette instance");
				console.log("Avec "+niv+" niveau(x) de communication,, les deux méthodes donnent la mème performance pour cette instance");
			}
			console.log("")		
		}	
		
		});
	$('#eval2').click(function() {
        if (heuristique==null){
			alert("Veillez lancer l'heuristique d'euler d'abord ");
		}
		else if (ac==null){
			alert("Veillez lancer ACO d'abord ");
		}
		else{
		var niv = prompt("Veuillez préciser le niveau de communication","niveau");
		alert("Patientez, évaluation en cours ...");
		console.log("")
		console.log("****Evaluation 2 : ACO vs Heuristique d'Euler***")
		var evaluation=new Eval(G,heuristique.getTour(),niv);
		evaluation.addACOsol(ac._globalBest.getTour());
		evaluation.calculTableRoutage();
		
		evaluation.run(2);
		console.log("fin eval");
		console.log("métrique pour ACO="+evaluation._metriqueACO+"%");
		console.log("métrique pour Euler="+evaluation._metriqueEuler+"%");
			if (evaluation._metriqueACO > evaluation._metriqueEuler){
				alert("Avec "+niv+" niveau(x) de communication, la méthode ACO est meilleure que celle de l'heuristique d'euler pour cette instance. L'amélioration obtenue est de "+(evaluation._metriqueACO-evaluation._metriqueEuler)+ " %");
				console.log("Avec "+niv+" niveau(x) de communication, la méthode ACO est meilleure que celle de l'heuristique d'euler pour cette instance. L'amélioration obtenue est de "+(evaluation._metriqueACO-evaluation._metriqueEuler)+ " %");
			}
			else if (evaluation._metriqueACO < evaluation._metriqueEuler) {
				alert("Avec "+niv+" niveau(x) de communication, la méthode de l'heuristique d'euler  est meilleure que ACO. L'amélioration obtenue est de "+(evaluation._metriqueEuler-evaluation._metriqueACO) +" %");
				console.log("Avec "+niv+" niveau(x) de communication, la méthode de l'heuristique d'euler  est meilleure que ACO. L'amélioration obtenue est de "+(evaluation._metriqueEuler-evaluation._metriqueACO) +" %");			
			}
			else{
				alert("Avec "+niv+" niveau(x) de communication,, les deux méthodes donnent la mème performance pour cette instance");
				console.log("Avec "+niv+" niveau(x) de communication,, les deux méthodes donnent la mème performance pour cette instance");
			}
		}
		console.log("")		
    });
	
	});