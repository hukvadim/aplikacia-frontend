import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiBaseUrl, apiUrl, extractYouTubeVideoId, getData } from "../utils/utils";
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineAppstoreAdd  } from "react-icons/ai";
import { FaSun, FaMoon } from "react-icons/fa";
import parse from "html-react-parser";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const [course, setCourse] = useState({});
  const [test, setTest] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Завантаження стану теми
  });

  const { user, isAuthenticated, canRender } = useAuth();

  useEffect(() => {
    async function fetchCourseData() {
      const courseData = await getData(`${apiUrl.courseById}${id}`);
      setCourse(courseData);

      const testData = await getData(`${apiUrl.testsByCourse + id}`);
      setTest(testData);
    }
    fetchCourseData();
  }, [id]);

  // Функція для перемикання теми
  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode); // Збереження в localStorage
      return newMode;
    });
  };


  useEffect(() => {
    // Додавання або видалення класу в body
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleTestClick = () => {
    if (isAuthenticated) {
      navigate(`/test/${test._id}`);
    } else {
      navigate("/login");
    }
  };


  // Функція для отримання іконки в залежності від типу файлу
  const getFileIcon = (fileName) => {
    const fileExtension = fileName.split(".").pop().toLowerCase();
    switch (fileExtension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📄";
      case "zip":
      case "rar":
        return "🗂️";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  return (
    <div className={`course-detail ${darkMode ? "dark-mode" : "light-mode"}`}>

      <div className="navigation-buttons d-flex gap-20 flex-items-center">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost flex-stretch btn-back"
          title=" Späť"
        >
          <AiOutlineArrowLeft />
        </button>

        {
          canRender(course.created_by) &&
          <>
            <button
              onClick={() => navigate(`/edit-course/${id}`)}
              className="btn btn-ghost flex-stretch btn-edit"
              title="Upraviť temu "
            >
              <AiOutlineEdit />
            </button>
        
            <button
              onClick={() => navigate((test?._id) ? `/edit-test/${test._id}` : `/test-form`)}
              className="btn btn-ghost flex-stretch btn-edit"
              // style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#28a745" }}
              title="Upraviť test"
            >
              <AiOutlineAppstoreAdd />
            </button>
          </>
        }
        <button onClick={toggleTheme} className="btn btn-ghost flex-stretch theme-toggle" title="Zmeniť tému">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

      </div>
      <h2 className="course-title">{course.title}</h2>
      <p className="course-description">{course.description}</p>

      <div className="course-media">
        <img
          src={`${apiBaseUrl}/public/img/courses/${course.img ?? 'no-image.jpg'}`}
          alt="Nastavenie kurzu "
          className="course-image"
        />
      </div>
      {course.article && (
        <div className="course-article">
          <div className="typography">{parse(course.article)}</div>
        </div>
      )}

      {(course.video_link && typeof course.video_link === "string" && course.video_link !== "null") ? (
        <div className="course-media">
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(course.video_link)}`}
            title="Video kurzu"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : ''}

      {course.files && (
        <div className="course-resources">
          <h3>Ďalšie materiály:</h3>
          <ul className="file-list">
            {course.files.split(",").map((file, index) => (
              <li key={index} className="file-item">
                <span className="file-icon">{getFileIcon(file)}</span>
                <a
                  href={`${apiBaseUrl}/public/files/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-link"
                  download
                >
                  {/* file.split("/").pop() */}
                  {`Študijný materiál ${index + 1}`}
                </a>
                <a
                  href={`${apiBaseUrl}/public/files/${file}`}
                  download
                  className="file-download"
                >
                  ⬇️ Stiahnuť
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="course-meta">
        <p>
          <strong>Vytvorené: </strong>{" "}
          {new Date(course.created_at).toLocaleDateString()}
        </p>
      </div>

      {test?._id ? (
        user?.role === "user" ? (
          <div className="course-tests">
            <button onClick={handleTestClick} className="btn btn-sm">
              Otestovať sa
            </button>
          </div>
        ) : (
          <div className="course-tests">
            <p>
              Otestovať sa môže iba prihlásený používateľ.{' '}
              <a href="/login" className="text-blue-500 underline">
                Prihlásiť sa
              </a>
            </p>
          </div>
        )
      ) : null}

    </div>
  );
}
