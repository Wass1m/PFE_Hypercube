import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { Link as Linkus } from "react-router-dom";
import logo from "../img/logo.png";
import etude1 from "../img/etude1.png";
import etude2 from "../img/etude2.png";
import etude3 from "../img/etude3.png";
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

//  #90caf9"
const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  hero_first: {
    backgroundImage: `url(${logo})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: 400,
  },
  heroContent: {
    backgroundColor: "#424242",
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: "#424242",
    padding: theme.spacing(6),
  },
  appBar: {
    backgroundColor: "#90caf9",
    color: "black",
  },
  typo: {
    color: "white",
  },
}));

const cards = [
  [1, etude1, "Test selon la complexite des graphes"],
  [2, etude2, "Test selon le nombre de niveaux"],
  [3, etude3, "Test sur les parametres de l'ACO"],
];

export default function MainInterface() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar className={classes.appBar} position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Interface d'execution
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.hero_first}></div>
        <div className={classes.heroContent}>
          <Container>
            <Typography
              className={classes.typo}
              component="h1"
              variant="h2"
              align="center"
              gutterBottom
            >
              Etude d’un problème d’interblocagedans les architectures
              parallèles avec les colonies de fourmis
            </Typography>
            <Typography
              className={classes.typo}
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Encadre par Mustafa Hadim BOUKHALFA et Presente par Mohamed Wassim
              GHERNAOUT
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Linkus style={{ textDecoration: "none" }} to="/main">
                    <Button variant="contained" color="primary">
                      Test sur l'hypercube(n)
                    </Button>
                  </Linkus>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card[1]}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Etude {card[0]}
                    </Typography>
                    <Typography>{card[2]}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Tester
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
