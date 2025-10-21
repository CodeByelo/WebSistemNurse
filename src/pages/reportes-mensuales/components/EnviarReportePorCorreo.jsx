import React, { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "../../../components/ui/Button";

export default function EnviarReportePorCorreo({ graficoBarrasRef, graficoPastelRef, mes, anio }) {
  const [enviando, setEnviando] = useState(false);

  const generarPDFyEnviar = async () => {
    setEnviando(true);
    const pdf = new jsPDF("p", "mm", "a4");

    // Capturar gráfico barras
    const canvasBar = await html2canvas(graficoBarrasRef.current);
    const imgBar = canvasBar.toDataURL("image/png");
    pdf.addImage(imgBar, "PNG", 10, 10, 190, 90);

    // Capturar gráfico pastel
    const canvasPie = await html2canvas(graficoPastelRef.current);
    const imgPie = canvasPie.toDataURL("image/png");
    pdf.addImage(imgPie, "PNG", 10, 110, 190, 90);

    pdf.text(`Reporte mensual - ${mes}/${anio}`, 10, 210);

    // Convertir a blob y enviar vía Edge Function
    const blob = pdf.output("blob");
    const form = new FormData();
    form.append("pdf", blob, `reporte_${anio}_${mes}.pdf`);

    await fetch("/.netlify/functions/enviarReporte", {
      method: "POST",
      body: form,
    });

    setEnviando(false);
    alert("📧 Reporte enviado por correo");
  };

  return (
    <Button onClick={generarPDFyEnviar} disabled={enviando} iconName="mail">
      {enviando ? "Enviando..." : "Enviar reporte por correo"}
    </Button>
  );
}