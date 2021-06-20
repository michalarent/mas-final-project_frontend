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

import Router from "next/router";
import Navigation from "../components/Navigation";

const SONGS_REST_API_URL = "http://localhost:8080/songs";
const ARTISTS_REST_API_URL = "http://localhost:8080/artists";
const PERFORMERS_REST_API_URL = "http://localhost:8080/performers";

export default function Songs() {
  const [hover, setHover] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songArtistDict, setSongArtistDict] = useState([]);
  useEffect(() => {
    axios.get(SONGS_REST_API_URL).then((res) => setSongs(res.data));
    axios.get(ARTISTS_REST_API_URL).then((res) => setArtists(res.data));
  }, []);

  console.log(artists);

  useEffect(() => {
    const temp = {};
    for (var song of songs) {
      temp.songId = song.id;
      temp.artistName = getArtistForSong(song.id)?.data?.name;
    }
  }, [songs]);

  useEffect(() => {});

  const getArtistForSong = (id) => {
    for (var artist of artists) {
      for (var idAlbum of artist.albumsDto) {
        console.log(idAlbum.id + ", " + id);
        if (idAlbum.id === id) {
          return artist.name;
        }
      }
    }
  };

  return (
    <>
      <Navigation />
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
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ background: "black" }}>
                <TableCell style={{ color: "white" }}>Title</TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Album
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Artist
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {songs.map((item) => (
                <TableRow key={item.id}>
                  {console.log(item)}
                  <TableCell component="th" scope="row">
                    {item?.title}
                  </TableCell>
                  <TableCell style={{ maxWidth: "10rem" }} align="right">
                    {item.plainAlbumDtoSet[0].title}
                  </TableCell>
                  <TableCell align="right">
                    {getArtistForSong(item.plainAlbumDtoSet[0]?.id)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
