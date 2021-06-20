import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { NoSsr } from "@material-ui/core";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import AlbumIcon from "@material-ui/icons/Album";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import { useRouter } from "next/router";
import Link from "next/link";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    background: "white",
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Navigation() {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <NoSsr>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          style={{ background: "black", boxShadow: "white" }}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon style={{ fill: "white" }} />
            </IconButton>
            <Typography variant="h6" noWrap>
              MAS Final Project
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          style={{ background: "white!important" }}
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon style={{ fill: "black" }} />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem key={"Albums"} button>
              <Link href="/">
                <>
                  <ListItemIcon onClick={() => router.push("/")}>
                    <AlbumIcon style={{ fill: "black" }} />
                  </ListItemIcon>

                  <ListItemText primary={"Albums"} />
                </>
              </Link>
            </ListItem>

            <ListItem button key={"Songs"}>
              <Link href="/songs">
                <>
                  <ListItemIcon onClick={() => router.push("/songs")}>
                    <LibraryMusicIcon style={{ fill: "black" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Songs"} />
                </>
              </Link>
            </ListItem>
            <ListItem button key={"Artists"}>
              <Link href="/artists">
                <>
                  <ListItemIcon onClick={() => router.push("/artists")}>
                    <SupervisedUserCircleIcon style={{ fill: "black" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Artists & Performers"} />
                </>
              </Link>
            </ListItem>
          </List>
          <Divider style={{ backgroundColor: "black" }} />
        </Drawer>
      </div>
    </NoSsr>
  );
}
