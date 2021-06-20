import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Modal } from "@material-ui/core";
import axios from "axios";
import styles from "../styles/modal.module.css";
import AddPerformer from "./AddPerformer";
import AddArtist from "./AddArtist";
import { useForm } from "react-hook-form";
import Router from "next/router";
import BlankForm from "./BlankForm";

const ALBUMS_REST_API_URL = "http://localhost:8080/albums";
const ARTISTS_REST_API_URL = "http://localhost:8080/artists";
const PERFORMERS_REST_API_URL = "http://localhost:8080/performers";

export default function AlbumComponent() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [addPerformer, setAddPerformer] = useState(false);
  const [addArtist, setAddArtist] = useState(false);

  async function getArtists() {
    await axios.get(ARTISTS_REST_API_URL).then((res) => setArtists(res.data));
  }

  useEffect(() => {
    axios.get(ALBUMS_REST_API_URL).then((res) => setAlbums(res.data));
    axios.get(ARTISTS_REST_API_URL).then((res) => setArtists(res.data));
    axios.get(PERFORMERS_REST_API_URL).then((res) => setPerformers(res.data));
  }, [isUpdated]);

  console.log(albums);
  const handleOpenArtist = () => {
    setAddArtist(true);
    setOpen(true);
  };

  const handleOpenPerformer = () => {
    setAddPerformer(true);
    setOpen(true);
  };
  const handleOpenAlbum = () => {
    setAddAlbum(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddArtist(false);
    setAddPerformer(false);
  };

  const handleOpenAddPerfomer = () => {
    setOpen(true);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function deleteHandler(id) {
    setIsUpdated(false);
    await axios.delete(ALBUMS_REST_API_URL + `/${id}`);
    setIsUpdated(true);
  }

  async function onSubmit(data) {
    setIsUpdated(false);
    console.log(data);
    await axios.post(ALBUMS_REST_API_URL, {
      title: data.example,
      description: data.exampleRequired,
    });
    setOpen(false);
    setIsUpdated(true);
  }

  function getArtistById(id) {
    var returnArtist = [];
    for (let artist of artists) {
      if (artist.id == id) {
        returnArtist = artist;
      }
    }
    return returnArtist;
  }

  function getPerformerNameById(id) {
    var returnPerformer = [];
    for (let performer of performers) {
      if (performer.id == id) {
        console.log(performer);
        if (performer.firstName != null) {
          returnPerformer = performer;
          performer.name = performer.firstName + " " + performer.lastName;
        }
      }
    }
    return returnPerformer;
  }

  function printArray(data) {
    for (var item in data) {
      if (item == null) {
        return false;
      }
    }
    return true;
  }

  const body = (
    <div>
      <div className={styles.modalBody} style={{ background: "black" }}>
        <div className={styles.modalContent}>
          {addPerformer ? (
            <AddPerformer handleClose={handleClose} />
          ) : (
            <AddArtist handleClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        style={{
          height: "50vh",
          width: "60vw",
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: "-30vw",
          marginTop: "-25vh",
        }}
      >
        <TableContainer component={Paper}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow style={{ background: "black" }}>
                <TableCell style={{ color: "white" }}>Title</TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Description
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Songs
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Artist
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Performers
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Remove
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {albums.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.title}
                  </TableCell>
                  <TableCell style={{ maxWidth: "10rem" }} align="right">
                    {item.description}
                  </TableCell>
                  <TableCell align="right">
                    {item.songsDto.map((song) => (
                      <>
                        <p>{song.title}</p>
                      </>
                    ))}
                  </TableCell>

                  <TableCell align="right">
                    <p>
                      {item.artistId != null
                        ? getArtistById(item.artistId.artistId).name
                        : "Not assigned"}
                    </p>
                  </TableCell>
                  <TableCell align="right">
                    <p>
                      {item.artistId != null
                        ? getArtistById(item.artistId.artistId).performersDto !=
                          null
                          ? getArtistById(
                              item.artistId.artistId
                            ).performersDto.map((performer) => (
                              <>
                                <p>{getPerformerNameById(performer.id).name}</p>
                              </>
                            ))
                          : "Not assigned"
                        : "Not assigned"}
                    </p>
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => deleteHandler(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <Button variant="contained" onClick={handleOpenArtist}>
                  Add Artist
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" onClick={handleOpenPerformer}>
                  Add Performer
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  onClick={() => Router.push("/new-album")}
                >
                  Add LP / EP
                </Button>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
}
