import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Styles/UploadPage.css";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const similarCases = [
    {
      id: 1,
      imageUrl: "https://radiopaedia.org/images/1567749",
      diagnosis: "Перелом лучевой кости",
      match: 88,
      description: "Классический перелом дистального отдела",
    },
    {
      id: 2,
      imageUrl: "https://radiopaedia.org/images/1567750",
      diagnosis: "Остеоартрит 2 степени",
      match: 76,
      description: "Сужение суставной щели, остеофиты",
    },
    {
      id: 3,
      imageUrl: "https://radiopaedia.org/images/1567751",
      diagnosis: "Трещина кости",
      match: 42,
      description: "Линейный перелом без смещения",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
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
      setFile(droppedFile);
      setFileUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleShare = (method: "telegram" | "copy") => {
    const reportUrl = `${window.location.origin}/report/${Date.now()}`;

    if (method === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          reportUrl
        )}&text=Мой%20рентген-анализ`
      );
    } else {
      navigator.clipboard.writeText(reportUrl);
      alert("Ссылка скопирована в буфер обмена!");
    }

    setShowShareModal(false);
  };

  const handleDownloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Добавляем основное содержимое
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Добавляем дополнительные элементы
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(`Дата: ${new Date().toLocaleString()}`, 10, 10);

      // Добавляем watermark
      pdf.setFontSize(40);
      pdf.setTextColor(200, 200, 200);
      pdf.text("МедАнализ", pdfWidth / 2, pdfHeight / 2, { angle: 45 });

      pdf.save(`рентген-анализ_${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert("Не удалось создать PDF");
    }
  };

  return (
    <div className="upload-page" ref={pdfRef}>
      {!file ? (
        <div
          className={`upload-container ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <h2 className="title">
              <span className="gradient-text">Анализ рентгена</span> за секунды
            </h2>

            <div
              className="drop-zone"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <div className="drop-content">
                <svg className="upload-icon" viewBox="0 0 24 24">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="drop-text">
                  {isDragging
                    ? "Отпустите файл"
                    : "Нажмите или перетащите файл"}
                </p>
                <p className="drop-hint">Поддерживаются JPG, PNG, DICOM</p>
              </div>
            </div>

            <button
              onClick={() => document.getElementById("fileInput")?.click()}
              className="upload-button"
            >
              Загрузить фото
            </button>

            <input
              id="fileInput"
              type="file"
              accept="image/*,.dcm"
              onChange={handleFileChange}
              className="hidden-input"
            />
          </div>
        </div>
      ) : (
        <div className="results-page">
          <button onClick={() => setFile(null)} className="back-button">
            <svg className="back-icon" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад
          </button>

          <div className="results-grid">
            <div className="image-section">
              <h3 className="section-title">Ваш рентген</h3>
              {fileUrl && (
                <img
                  src={fileUrl}
                  alt="Загруженное фото"
                  className="xray-image"
                />
              )}
            </div>

            <div className="diagnosis-section">
              <h2 className="diagnosis-title">
                <span className="gradient-text">Результат</span> анализа
              </h2>

              <div className="diagnosis-card">
                <h3 className="card-title">Диагноз</h3>
                <ul className="diagnosis-list">
                  <li className="diagnosis-item">
                    <span className="bullet">•</span>
                    Перелом правой лучевой кости
                  </li>
                  <li className="diagnosis-item">
                    <span className="bullet">•</span>
                    Смещение отломков на 3-4 мм
                  </li>
                </ul>
              </div>

              <div className="recommendations-card">
                <h3 className="card-title">Рекомендации</h3>
                <ul className="recommendations-list">
                  <li className="recommendation-item">
                    <span className="bullet pink">•</span>
                    Консультация травматолога
                  </li>
                  <li className="recommendation-item">
                    <span className="bullet pink">•</span>
                    Гипсовая иммобилизация
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="similar-cases">
            <h3 className="similar-title">Похожие медицинские случаи</h3>

            <div className="cases-list">
              {similarCases.map((caseItem) => (
                <div key={caseItem.id} className="case-card">
                  <div className="case-image-container">
                    <img
                      src={caseItem.imageUrl}
                      alt={caseItem.diagnosis}
                      className="case-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgNWEyIDIgMCAwIDEgMi0yaDEyYTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg2YTIgMiAwIDAgMS0yLTJWNXptMTIgMGEyIDIgMCAxIDAtNCAwIDIgMiAwIDAgMCA0IDB6Ii8+PC9zdmc+";
                      }}
                    />
                  </div>
                  <div className="case-details">
                    <h4 className="case-diagnosis">{caseItem.diagnosis}</h4>
                    <p className="case-description">{caseItem.description}</p>
                    <div className="match-container">
                      <div
                        className="match-bar"
                        style={{ width: `${caseItem.match}%` }}
                      ></div>
                      <span className="match-percent">
                        {caseItem.match}% совпадение
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleDownloadPDF}
              className="action-button save-button"
            >
              Скачать PDF
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="action-button share-button"
            >
              Поделиться
            </button>

            <button
              onClick={() => window.print()}
              className="action-button print-button"
            >
              Распечатать
            </button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h3 className="modal-title">Поделиться результатами</h3>

            <div className="share-options">
              <button
                onClick={() => handleShare("telegram")}
                className="share-option telegram"
              >
                <svg className="share-icon" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394a.759.759 0 0 1-.6.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.57-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                Telegram
              </button>

              <button
                onClick={() => handleShare("copy")}
                className="share-option copy-link"
              >
                <svg className="share-icon" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                Копировать ссылку
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="close-modal"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;