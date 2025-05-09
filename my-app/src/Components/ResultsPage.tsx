import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Styles/result.css";
import Comments from "./UploadButtons/Comments";

interface ResultsPageProps {
  file: File | null;
  fileUrl: string | null;
  onBack: () => void;
  metadata?: {
    name: string;
    surname: string;
    age: string;
    doctor: string;
  } | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
  fileUrl,
  onBack,
  metadata,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  console.log("Metadata in ResultsPage:", metadata);

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

        <button onClick={onBack} className="back-button">
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
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
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

              <div className="share-options">
                <button
                  onClick={() => handleShare("telegram")}
                  className="share-option telegram"
                >
                  <svg className="share-icon" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394a.759.759 0 0 1-.6.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.57-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  Отправить в Telegram
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
      <Comments initialUsername={metadata?.name || "Не указано"} />
    </div>
  );
};

export default ResultsPage;