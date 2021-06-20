import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import { useForm, Controller } from "react-hook-form";
import ReactSelect, { components } from "react-select";
import {
  TextField,
  Checkbox,
  Divider,
  RadioGroup,
  FormControlLabel,
  ThemeProvider,
  Radio,
  createMuiTheme,
  Modal,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import styles from "../styles/form.module.css";
import modal_styles from "../styles/modal.module.css";

const ARTISTS_REST_API_URL = "http://localhost:8080/artists";
const PERFORMERS_REST_API_URL = "http://localhost:8080/performers";
const SONGS_REST_API_URL = "http://localhost:8080/songs";
const ALBUMS_REST_API_URL = "http://localhost:8080/albums";

const useStyles = makeStyles({
  table: {
    minWidth: "100%",
    background: "black",
  },
  tableContainer: {
    width: "50vw",
    height: "50vh",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: "-25vw",
    marginTop: "-25vh",
  },
});

export default function BlankForm() {
  const [artists, setArtists] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [songs, setSongs] = useState([]);
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(null);
  const hiddenSongInput = React.useRef(null);
  const hiddenImageInput = React.useRef(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const defaultValues = {
    isExplicit: false,
    albumType: null,
    albumTitle: null,
    albumDescription: null,
    image: image,
    imageFile: null,
    songs: songs,
  };

  const {
    setValue,
    handleSubmit,
    register,
    reset,
    control,
    watch,
    trigger,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  console.log(errors);
  console.log(isValid);
  const [data, setData] = useState(null);

  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: "dark",
    },
  });

  const handleUploadImageClick = (event) => {
    hiddenImageInput.current.click();
  };

  const handleUploadImageChange = (event) => {
    const file = event.target.files[0];
    setValue("imageFile", file);
    const img = URL.createObjectURL(file);
    setImage(img);

    console.log(file.name);
    trigger();
  };

  const addSong = (newSong) => setSongs((state) => [...state, newSong]);

  const handleUploadSongClick = (event) => {
    setUpdatedSongs(true);
    hiddenSongInput.current.click();
  };

  const [updatedSongs, setUpdatedSongs] = useState(false);

  async function handleUploadSongChange(event) {
    setUpdatedSongs(false);
    const file = event.target.files[0];
    addSong(file);
    setUpdatedSongs(true);
    console.log(file.name);
    await trigger();
  }

  async function getArtists() {
    await axios.get(ARTISTS_REST_API_URL).then((res) => setArtists(res.data));
  }

  React.useLayoutEffect(() => {
    async function fetchArtists() {
      let response = await fetch(ARTISTS_REST_API_URL);
      response = await response.json();
      setArtists(response);
    }
    async function fetchPerformers() {
      let response = await fetch(PERFORMERS_REST_API_URL);
      response = await response.json();
      setPerformers(response);
    }
    fetchPerformers();
    fetchArtists();
  }, []);

  useEffect(() => {
    setValue("songs", songs);
  }, [songs]);

  useEffect(() => {
    console.log(isValid);
  }, [updatedSongs]);

  useEffect(() => {
    setValue("image", image);
  }, [image]);

  function getPerformerNameById(id) {
    var returnPerformer = [];
    for (let performer of performers) {
      if (performer?.plainArtistDtoSet != null) {
        if (performer?.plainArtistDtoSet[0]?.artistId == id) {
          if (performer.firstName != null) {
            performer.name = performer.firstName + " " + performer.lastName;
            returnPerformer.push(performer);
          }
        }
      }
    }

    return returnPerformer;
  }

  console.log(errors);

  let options = artists.map(function (artist) {
    let performers = getPerformerNameById(parseInt(artist.id));
    return {
      value: artist.id,
      label: artist.name,
      subLabel: artist.id,
      performers: performers,
    };
  });

  console.log(watch("isExplicit"));
  console.log(watch("albumType"));
  console.log(watch("albumTitle"));
  console.log(watch("albumDescription"));
  console.log(watch("artist"));
  console.log(watch("songs"));
  console.log(watch("image"));
  console.log(watch("imageFile"));

  const Option = (props) => {
    console.log(props.data.performers);
    return (
      <components.Option {...props}>
        <Grid container xs={12} md={12}>
          <Grid item xs={5} md={5} >
            <div>{props.data.label}</div>
          </Grid>
          <Grid item xs={5} md={5}>
            {props.data.performers.length > 0 ? (
              <div
                style={{
                  fontSize: 12,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    verticalAlign: "middle",
                    lineHeight: "normal",
                  }}
                >
                  {props.data.performers.map((performer) => (
                    <>
                      {performer.name}
                      <br></br>
                    </>
                  ))}
                </span>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={2} md={2}>
            <div
              style={{
                fontSize: 12,
                textAlign: "right",
              }}
            >
              <span
                style={{
                  textAlign: "right",
                  verticalAlign: "middle",
                  lineHeight: "normal",
                }}
              >
                {props.data.performers.length} performers
              </span>
            </div>
          </Grid>
        </Grid>
      </components.Option>
    );
  };
  const onSubmit = async (data) => {
    const reader = new FileReader();

    const postAlbum = await axios.post(ALBUMS_REST_API_URL, {
      title: data.albumTitle,
      description: data.albumDescription,
      coverImage: reader.readAsDataURL(data.imageFile),
    });
    const postAlbumResponse = postAlbum.data.id;
    console.log(postAlbum.data.id);

    const postSongsResponse = [];
    for (var song of songs) {
      const postSongz = await axios.post(SONGS_REST_API_URL, {
        title: song.name,
      });
      console.log(song);
      console.log(postSongz);
      await postSongsResponse.push(postSongz.data.id);
    }
    console.log(postSongsResponse);
    console.log("postSongs");

    console.log(postSongsResponse);

    for (var songId of postSongsResponse) {
      await axios.post(
        `${ALBUMS_REST_API_URL}/${postAlbumResponse}/songs/${songId}/add`
      );
      console.log(songId);
    }

    console.log("postSongsToAlbum");

    const addAlbumToArtist = await axios.post(
      `${ARTISTS_REST_API_URL}/${data.artist.value}/albums/${postAlbumResponse}/add`
    );

    const getAlbum = axios.get(`${ALBUMS_REST_API_URL}/${postAlbumResponse}`);

    Router.push("/");
    console.log(getAlbum);
  };

  function minimumOneSong() {
    return songs.length > 0;
  }

  function coverImageIsSet() {
    return image != null;
  }

  const body = (
    <>
      <div className={modal_styles.modalBody}>
        <div className={modal_styles.modalContent}>
          <Grid container spacing={12}>
            <Grid container lg={5} sm={5} xs={5} spacing={2}>
              <div className={styles.imageContainer}>
                <img src={image} className={modal_styles.modalImage} />
              </div>
            </Grid>
            <Grid container lg={1}></Grid>
            <Grid container lg={5} sm={5} xs={5} spacing={0}>
              <Grid container md={12}>
                <Grid item md={6}>
                  <h2 className={modal_styles.modalHeader}>
                    {watch("albumTitle")}
                  </h2>
                </Grid>
                <Grid item md={6} style={{ textAlign: "right" }}>
                  <h4 className={modal_styles.modalAlbumType}>
                    Type: {watch("albumType")}
                  </h4>
                  <h4 className={modal_styles.modalAlbumType}>
                    {watch("isExplicit") ? "Explicit" : "Safe"}
                  </h4>
                </Grid>
              </Grid>
              <Grid container md={12}>
                <Grid item md={12}>
                  <h3 className={modal_styles.modalSubTitle}>
                    {watch("albumDescription")}
                  </h3>
                  <Divider style={{ background: "black" }} />
                </Grid>
              </Grid>
              <Grid item md={5}>
                {console.log(watch("artist"))}
                <h4 className={modal_styles.modalAlbumType}>
                  Artist: {watch("artist")?.label}
                </h4>
                <h4 className={modal_styles.modalAlbumType}>Performers:</h4>
                <ul className={modal_styles.modalPerformersList}>
                  {watch("artist")?.performers.map((performer) => (
                    <li>{performer.name}</li>
                  ))}
                </ul>
              </Grid>
              <Grid item md={5}>
                <ul>
                  {watch("songs")?.map((song) => (
                    <li>{song.name}</li>
                  ))}
                </ul>
              </Grid>
              <Grid item md={12}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  style={{ float: "right" }}
                  variant="contained"
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.page}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Grid container>
            <Grid container xs={12} md={4} lg={2}>
              <Grid item xs={4} md={10} lg={10}>
                <section className={styles.section}>
                  <label className={styles.label}>Is the album explicit?</label>
                  <Controller
                    name="isExplicit"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox onChange={onChange} checked={value} />
                    )}
                  />
                </section>
                <Grid item xs={12} md={12}>
                  <section className={styles.section}>
                    <label className={styles.label}>
                      What is the album type?
                    </label>
                    <Controller
                      rules={{
                        required: true,
                        message: "Your must specify the album type!",
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { isInvalid },
                        formState,
                      }) => (
                        <RadioGroup
                          aria-label="gender"
                          value={value}
                          onChange={onChange}
                        >
                          <FormControlLabel
                            value="longplay"
                            control={<Radio />}
                            label="Long Play"
                            className={styles.radioLabel}
                          />
                          <FormControlLabel
                            value="extendedplay"
                            control={<Radio />}
                            label="Extended Play"
                            className={styles.radioLabel}
                          />
                          <FormControlLabel
                            value="Compilation"
                            control={<Radio />}
                            label="Compilation"
                            className={styles.radioLabel}
                          />
                        </RadioGroup>
                      )}
                      name="albumType"
                      control={control}
                    />
                  </section>
                </Grid>
              </Grid>
            </Grid>
            <Grid container xs={12} md={7} lg={5}>
              <Grid item xs={12} md={12} lg={10}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the album title?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 5,
                      maxLength: 80,
                      message: "The title must contain at least 5 characters!",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          onChange={onChange}
                          value={value}
                          style={{ width: "100%" }}
                        />
                      </>
                    )}
                    name="albumTitle"
                    control={control}
                  />
                </section>
              </Grid>
              <Grid item xs={12} md={12} lg={10}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the album description?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 5,
                      message:
                        "The description must contain at least 5 characters!",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TextField
                          multiline
                          onChange={onChange}
                          value={value}
                          variant="outlined"
                          size="medium"
                          style={{ width: "100%" }}
                          className={styles.description}
                        />
                      </>
                    )}
                    name="albumDescription"
                    control={control}
                  />
                </section>
              </Grid>
              <Grid item item xs={12} md={12} lg={10}>
                <label className={styles.label}>
                  What is the cover art for the album?
                </label>
                <section className={styles.section}>
                  <img
                    src={image != null ? image : null}
                    className={styles.uploadedImage}
                  />
                </section>
              </Grid>

              <Grid item item xs={12} md={12}>
                <section className={styles.section}>
                  <Button
                    className={styles.imageUploadButton}
                    variant="outlined"
                    onClick={handleUploadImageClick}
                  >
                    Upload Cover Art
                  </Button>
                  <input
                    {...register("image", {
                      validate: coverImageIsSet,
                    })}
                    accept=".png, .jpg, .jpeg"
                    type="file"
                    value={image == null ? null : image.name}
                    ref={hiddenImageInput}
                    onChange={handleUploadImageChange}
                    style={{ visibility: "hidden" }}
                  />
                </section>
              </Grid>
            </Grid>
            <Grid container xs={12} md={11} lg={5}>
              <Grid item item xs={12} md={12} lg={12}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    Who recorded the album?
                  </label>
                  <Controller
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <ReactSelect
                        onChange={onChange}
                        value={value}
                        options={options}
                        components={{ Option }}
                      />
                    )}
                    options={options}
                    name="artist"
                    isClearable
                    control={control}
                  />
                </section>
              </Grid>
              <Grid item item xs={12} md={12} lg={12}>
                <label className={styles.label}>
                  What are the songs available on the album?
                </label>
                <section className={styles.section}>
                  <div className={styles.uploadedImage}>
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell
                              style={{
                                whiteSpace: "normal",
                              }}
                              align="left"
                            >
                              Type
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {songs.map((song) => (
                            <TableRow key={song.name}>
                              <TableCell
                                style={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                                component="th"
                                scope="row"
                              >
                                {song.name}
                              </TableCell>
                              <TableCell align="left">{song.type}</TableCell>
                              <TableCell align="right"></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </section>
                <Button
                  className={styles.imageUploadButton}
                  variant="outlined"
                  onClick={handleUploadSongClick}
                >
                  Upload a Song
                </Button>
                <input
                  {...register("songs", {
                    validate: minimumOneSong,
                  })}
                  type="file"
                  accept="audio/*"
                  ref={hiddenSongInput}
                  onChange={handleUploadSongChange}
                  style={{ display: "none" }}
                />
              </Grid>
              <Grid item md={8}>
                <Button
                  size="large"
                  style={{ float: "right" }}
                  variant={isValid ? "contained" : "disabled"}
                  onClick={handleOpen}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </main>
      <Modal onBackdropClick={handleClose} open={open}>
        {body}
      </Modal>
    </ThemeProvider>
  );
}
