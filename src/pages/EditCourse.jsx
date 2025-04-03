import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, MenuItem, IconButton, Typography } from "@mui/material";
import { PhotoCamera, AttachFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Container from "../components/Container";
import { RichTextEditor } from "@mantine/rte";
import parse from "html-react-parser";
import "../styles/RichTextStyles.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { apiUrl } from "../utils/utils";

const CourseSchema = Yup.object().shape({
  title: Yup.string().required("Názov kurzu je povinný").max(100, "Názov kurzu môže mať maximálne 100 znakov"),
  description: Yup.string().max(500, "Popis kurzu môže mať maximálne 500 znakov"),
  videoLink: Yup.string(),
  img: Yup.mixed().nullable(),
  files: Yup.mixed().nullable(),
  article: Yup.string().max(10000, "Článok môže mať maximálne 1000 znakov"),
  publish: Yup.string().required("Vyberte možnosť publikovania").oneOf(["yes", "no"], "Publikovanie musí byť 'yes' alebo 'no'")
});

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    fetch(apiUrl.courseById + id)
      .then((response) => response.json())
      .then((data) => {        
        setInitialValues({
          _id: data._id,
          title: data.title,
          description: data.description,
          videoLink: (data.video_link && typeof data.video_link === "string" && data.video_link !== "null") ? data.video_link : '',
          publish: data.publish,
          article: data.article,
          img: null,
          files: null,
        });
      })
      .catch((error) => console.error("Chyba pri načítaní údajov kurzu:", error));
  }, [id]);

  const handleSubmit = (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("_id", values._id);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("videoLink", values.videoLink);
    formData.append("publish", values.publish);
    formData.append("article", values.article);
    if (values.img) {
      formData.append("img", values.img);
    }
    if (values.files) {
      Array.from(values.files).forEach((file) => formData.append("files", file));
    }

    fetch(apiUrl.courseById + id, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Téma bola úspešne aktualizovaná");
          setTimeout(() => {
            navigate(`/course/${id}`);
          }, 2000);
        } else {
          toast.error("Nepodarilo sa aktualizovať tému");
        }
      })
      .catch((error) => {
        console.error("Chyba pri aktualizácii kurzu:", error);
        toast.error("Chyba pri aktualizácii témy");
      });
  };

  const RichTextDisplay = ({ article }) => (
    <div className="rich-text-container typography">
      {parse(article)}
    </div>
  );

  if (!initialValues) {
    return <p>Načítavanie údajov témy...</p>;
  }

  return (
    <section className="page-courses">
      <Container>
        <div className="navigation-buttons" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#007BFF" }}
            title="Späť"
          >
            <AiOutlineArrowLeft />
          </button>
        </div>
        <div className="content-hold">
          <div className="content">
            <Typography variant="h4" component="h1" gutterBottom>
            Upraviť tému 
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={CourseSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <div className="form-group">
                    <Field
                      name="title"
                      as={TextField}
                      label="Názov kurzu"
                      fullWidth
                      error={touched.title && !!errors.title}
                      helperText={<ErrorMessage name="title" />}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      fullWidth
                      margin="normal"
                      select
                      name="publish"
                      label="Publikovať"
                      value={values.publish}
                      onChange={(event) => setFieldValue("publish", event.target.value)}
                      error={touched.publish && Boolean(errors.publish)}
                      helperText={touched.publish && errors.publish}
                    >
                      <MenuItem value="no">nie</MenuItem>
                      <MenuItem value="yes">áno</MenuItem>
                    </TextField>
                  </div>

                  <div className="form-group">
                    <Field
                      name="videoLink"
                      as={TextField}
                      label="Odkáz na video (voliteľné)"
                      fullWidth
                      error={touched.videoLink && !!errors.videoLink}
                      helperText={<ErrorMessage name="videoLink" />}
                    />
                  </div>

                  <div className="form-group">
                    <Field
                      name="description"
                      as={TextField}
                      label="Popis témy"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.description && !!errors.description}
                      helperText={<ErrorMessage name="description" />}
                    />
                  </div>

                  
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography variant="body1">Obrázok témy:</Typography>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                    >
                      <PhotoCamera />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) => setFieldValue("img", event.currentTarget.files[0])}
                      />
                    </IconButton>
                  </div>

                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Typography variant="body1">Súbory(voliteľné):</Typography>
                    <IconButton
                      color="primary"
                      aria-label="upload files"
                      component="label"
                    >
                      <AttachFile />
                      <input
                        hidden
                        type="file"
                        multiple
                        onChange={(event) => setFieldValue("files", event.currentTarget.files)}
                      />
                    </IconButton>
                  </div>

                  <div className="form-group">
                    <Typography variant="body1">Článok:</Typography>
                    <RichTextEditor
                      value={values.article}
                      onChange={(value) => setFieldValue("article", value)}
                      controls={[
                        ['bold', 'italic', 'underline', 'strike', 'clean'],
                        ['h3', 'h4'],
                        ['unorderedList', 'orderedList'], 
                        ['link'],
                        
                      ]}
                    />
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
                      Náhľad článku:
                    </Typography>
                    <RichTextDisplay article={values.article} />
                  </div>


                  <div className="form-group">
                    <button type="submit" className="btn">
                    Uložiť zmeny 
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <ToastContainer />
          </div>
        </div>
      </Container>
    </section>
  );
}
