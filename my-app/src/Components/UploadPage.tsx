import React, { useState } from "react";
import "./Styles/UploadPage.css";

interface UploadMenuProps {
  onFileSelect: (file: File, fileUrl: string, metadata: { name: string, surname: string, age: string, doctor: string }) => void;
}

const UploadMenu: React.FC<UploadMenuProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    doctorName: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setErrorMessage(""); // Очистка ошибки после загрузки файла
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setSelectedFile(droppedFile);
      setFileUrl(URL.createObjectURL(droppedFile));
      setErrorMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage(""); // Очистка сообщения при изменении полей
  };

  const handleNext = () => {
    const metadata = {
      name: patientData.firstName,
      surname: patientData.lastName,
      age: patientData.age,
      doctor: patientData.doctorName
    };

    if (!patientData.firstName || !patientData.lastName || !patientData.age || !patientData.doctorName) {
      setErrorMessage("Пожалуйста, заполните все поля перед продолжением.");
      return;
    }

    if (!selectedFile || !fileUrl) {
      setErrorMessage("Пожалуйста, загрузите файл перед продолжением.");
      return;
    }

    onFileSelect(selectedFile, fileUrl, metadata);
  };

  return (
    <div
      className={`upload-container ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <h2 className="title">
          <span className="gradient-text">Медицинский анализ</span>{" "}
          <span className="text-white">снимков</span>
        </h2>

        <div className="data-form">
          <div className="name-row">
            <div className="input-field">
              <input
                type="text"
                name="firstName"
                value={patientData.firstName}
                onChange={handleInputChange}
                placeholder=" "
              />
              <label>Имя</label>
              <div className="underline"></div>
            </div>
            
            <div className="input-field">
              <input
                type="text"
                name="lastName"
                value={patientData.lastName}
                onChange={handleInputChange}
                placeholder=" "
              />
              <label>Фамилия</label>
              <div className="underline"></div>
            </div>
          </div>

          <div className="input-field">
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleInputChange}
              placeholder=" "
              className="no-spinner"
            />
            <label>Возраст</label>
            <div className="underline"></div>
          </div>

          <div className="input-field">
            <input
              type="text"
              name="doctorName"
              value={patientData.doctorName}
              onChange={handleInputChange}
              placeholder=" "
            />
            <label>Лечащий врач</label>
            <div className="underline"></div>
          </div>
        </div>

        <div
          className="drop-zone"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <div className="drop-content">
            <svg className="upload-icon" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="drop-text">
              {isDragging ? "Отпустите файл" : "Нажмите или перетащите файл"}
            </p>
            <p className="drop-hint">Поддерживаются JPG, PNG, DICOM</p>
            {selectedFile && <p className="file-loaded">Файл загружен: {selectedFile.name}</p>}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="next-button"
          disabled={!patientData.firstName || !patientData.lastName || !patientData.age || !patientData.doctorName || !selectedFile}
        >
          Анализ
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <input
          id="fileInput"
          type="file"
          accept="image/*,.dcm"
          onChange={handleFileChange}
          className="hidden-input"
        />
      </div>
    </div>
  );
};

export default UploadMenu;