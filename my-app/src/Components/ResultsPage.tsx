import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Styles/result.css";
import Comments from "./UploadButtons/Comments";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { fileUrl, metadata } = location.state || {};
  console.log("Metadata in ResultsPage:", metadata);

  const similarCases = [
    {
      id: 1,
      imageUrl: "https://www.ckbran.ru/upload/medialibrary/10b/r1kwcbrmtwpm04pi5zccep60ecjtuk83.jpg",
      diagnosis: "Перелом лучевой кости",
      match: 88,
      description: "Классический перелом дистального отдела",
    },
    {
      id: 2,
      imageUrl: "https://www.dikul.net/files/images/wiki/osteoartroz4.jpg",
      diagnosis: "Остеоартрит 2 степени",
      match: 76,
      description: "Сужение суставной щели, остеофиты",
    },
    {
      id: 3,
      imageUrl: "https://cs12.pikabu.ru/post_img/big/2022/08/15/4/1660537276129999906.jpg",
      diagnosis: "Трещина кости",
      match: 42,
      description: "Линейный перелом без смещения",
    },
  ];

  const handleShare = (method: "telegram" | "copy") => {
    const reportUrl = `${window.location.origin}/report/${Date.now()}`;

    if (method === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          reportUrl
        )}&text=Мой%20рентген-анализ%20${metadata?.surname || "Пациент"}`
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

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      pdf.setFontSize(10);
      pdf.setTextColor(40);
      pdf.text(
        `Пациент: ${metadata?.surname || "Не указано"} ${
          metadata?.name || "Не указано"
        }`,
        15,
        20
      );
      pdf.text(`Возраст: ${metadata?.age || "Не указано"}`, 15, 25);
      pdf.text(`Врач: ${metadata?.doctor || "Не указано"}`, 15, 30);
      pdf.text(`Дата: ${new Date().toLocaleDateString()}`, 15, 35);

      pdf.setFontSize(40);
      pdf.setTextColor(200, 200, 200, 30);
      pdf.text("МедАнализ", pdfWidth / 2, pdfHeight / 2, { angle: 45 });

      pdf.save(
        `анализ_${
          metadata?.surname || "пациент"
        }_${new Date().toLocaleDateString("ru-RU")}.pdf`
      );
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);
      alert("Не удалось создать PDF");
    }
  };

  const handleBack = () => {
    navigate("/uploadImages");
  };

  return (
    <div className="backGround">
      <div className="results-page" ref={pdfRef}>
        <div className="patient-header">
          <div className="patient-info-grid">
            <div className="patient-info-item">
              <span className="info-label">Пациент:</span>
              <span className="info-value">
                {metadata?.surname || "Не указано"}{" "}
                {metadata?.name || "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Возраст:</span>
              <span className="info-value">
                {metadata?.age ? `${metadata.age} лет` : "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Врач:</span>
              <span className="info-value">
                {metadata?.doctor || "Не указано"}
              </span>
            </div>
            <div className="patient-info-item">
              <span className="info-label">Дата исследования:</span>
              <span className="info-value">
                {new Date().toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>
        </div>

        <button onClick={handleBack} className="back-button">
          <svg className="back-icon" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </button>

        <div className="results-grid">
          <div className="image-section">
            <h3 className="section-title">Рентгеновский снимок</h3>
            {fileUrl && (
              <img
                src={fileUrl}
                alt="Рентгеновский снимок"
                className="xray-image"
              />
            )}
          </div>

          <div className="diagnosis-section">
            <h2 className="diagnosis-title">
              <span className="gradient-text">Заключение</span>{" "}
              врача-рентгенолога
            </h2>

            <div className="diagnosis-card">
              <h3 className="card-title">Основной диагноз</h3>
              <ul className="diagnosis-list">
                <li className="diagnosis-item">
                  <span className="bullet">•</span>
                  Перелом правой лучевой кости (дистальный метафиз)
                </li>
                <li className="diagnosis-item">
                  <span className="bullet">•</span>
                  Смещение отломков на 3-4 мм под углом 15°
                </li>
              </ul>
            </div>

            <div className="recommendations-card">
              <h3 className="card-title">Рекомендации</h3>
              <ul className="recommendations-list">
                <li className="recommendation-item">
                  <span className="bullet pink">•</span>
                  Консультация травматолога-ортопеда
                </li>
                <li className="recommendation-item">
                  <span className="bullet pink">•</span>
                  Гипсовая иммобилизация сроком на 4 недели
                </li>
                <li className="recommendation-item">
                  <span className="bullet pink">•</span>
                  Контрольный снимок через 10 дней
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="similar-cases">
          <h3 className="similar-title">Сравнение с аналогичными случаями</h3>

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
                      Совпадение: {caseItem.match}%
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
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M19 8h-4V3H9v5H5l7 7 7-7zM5 19v2h14v-2H5z" />
            </svg>
            <span className="button-text">Сохранить PDF</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="action-button share-button"
          >
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
            </svg>
            <span className="button-text">Поделиться</span>
          </button>

          <button
            onClick={() => window.print()}
            className="action-button print-button"
          >
            <svg
              className="button-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="white"
            >
              <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
            </svg>
            <span className="button-text text-white">Печать</span>
          </button>
        </div>

        {showShareModal && (
          <div className="share-modal-overlay">
            <div className="share-modal">
              <h3 className="modal-title">Поделиться результатами</h3>
              <p className="modal-subtitle">
                Для пациента: {metadata?.surname || "Не указано"}{" "}
                {metadata?.name || "Не указано"}
              </p>

              <div className="share-options ">
                <button
                  onClick={() => handleShare("telegram")}
                  className="share-option telegram"
                >
                  <svg className="share-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                  </svg>
                  Отправить в Telegram
                </button>

                <button
                  onClick={() => handleShare("copy")}
                  className="share-option copy-link "
                >
                  <svg className="share-icon" viewBox="0 0 24 24" fill="white">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  <p className="text-white">Копировать ссылку</p>
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
      <Comments initialUsername={metadata?.name || "Не указано"} />
    </div>
  );
};

export default ResultsPage;