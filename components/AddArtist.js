import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  ThemeProvider,
  createMuiTheme,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import ReactSelect from "react-select";

import styles from "../styles/form.module.css";


const PERFORMERS_REST_API_URL = "http://localhost:8080/performers";
const ARTISTS_REST_API_URL = "http://localhost:8080/artists";

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

export default function AddArtist({ handleClose }) {
  const [performers, setPerformers] = useState([]);

  React.useLayoutEffect(() => {
    async function fetchPerformers() {
      let response = await fetch(PERFORMERS_REST_API_URL);
      response = await response.json();
      setPerformers(response);
    }
    fetchPerformers();
  }, []);

  const {
    setValue,
    handleSubmit,
    register,
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

  console.log(watch("name"));
  console.log("chuj");
  console.log(watch("performers"));
  console.log(watch("description"));

  const onSubmit = async (data) => {
    console.log("here");
    console.log(data);
    const postArtist = await axios.post(ARTISTS_REST_API_URL, {
      name: data.name,
      description: data.description,
    });
    const postArtistResponse = postArtist.data.id;
    console.log(data.performers.performer);
    for (var p of data.performers) {
      console.log(p.performer);
      await axios.post(
        `${ARTISTS_REST_API_URL}/${postArtistResponse}/performers/${p.value}/add`
      );
    }

    handleClose();
  };

  let options = performers.map(function (performer) {
    const name = performer.firstName + " " + performer.lastName;
    return {
      value: performer.id,
      label: name,
      subLabel: performer.id,
      performer: performer,
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.pageModal}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.formModal}>
          <Grid container>
            <Grid container xs={12} md={12} lg={12}>
              <Grid item md={8}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the artist's name?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 2,
                      maxLength: 80,
                      message: "Name must contain at least 2 characters!",
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
                    name="name"
                    control={control}
                  />
                </section>
                <section className={styles.section}>
                  <label className={styles.label}>
                    Who are the performers?
                  </label>
                  <Controller
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <ReactSelect
                        onChange={onChange}
                        value={value}
                        options={options}
                        isMulti={true}
                      />
                    )}
                    options={options}
                    name="performers"
                    isClearable
                    control={control}
                  />
                </section>
              </Grid>
              <Grid item md={8} lg={8}>
                <section className={styles.section}>
                  <label className={styles.label}>
                    What is the performer's bio?
                  </label>
                  <Controller
                    rules={{
                      required: true,
                      minLength: 5,

                      message: "The bio must contain at least 5 characters!",
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
                    name="description"
                    control={control}
                  />
                </section>
              </Grid>
            </Grid>
            <Grid container xs={12} md={5} lg={5}>
              <Grid item md={8}>
                <Button
                  size="large"
                  style={{ float: "right" }}
                  variant={isValid ? "contained" : "disabled"}
                  onClick={handleSubmit(onSubmit)}
                >
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </main>
    </ThemeProvider>
  );
}
