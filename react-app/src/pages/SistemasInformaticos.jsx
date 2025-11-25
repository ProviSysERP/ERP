import React from "react";

import img1 from "../assets/Documento Sistemas Informaticos-01.png";
import img2 from "../assets/Documento Sistemas Informaticos-02.png";
import img3 from "../assets/Documento Sistemas Informaticos-03.png";
import img4 from "../assets/Documento Sistemas Informaticos-04.png";
import img5 from "../assets/Documento Sistemas Informaticos-05.png";
import img6 from "../assets/Documento Sistemas Informaticos-06.png";
import img7 from "../assets/Documento Sistemas Informaticos-07.png";
import img8 from "../assets/Documento Sistemas Informaticos-08.png";
import img9 from "../assets/Documento Sistemas Informaticos-09.png";
import img10 from "../assets/Documento Sistemas Informaticos-10.png";
import img11 from "../assets/Documento Sistemas Informaticos-11.png";
import img12 from "../assets/Documento Sistemas Informaticos-12.png";
import img13 from "../assets/Documento Sistemas Informaticos-13.png";

export default function SistemasInformaticos() {
  const images = [
    img1, img2, img3, img4, img5, img6, img7,
    img8, img9, img10, img11, img12, img13
  ];

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Documento Sistemas Informaticos ${index + 1}`}
          width={1159}
          height={1500}
          className="rounded-2xl shadow"
        />
      ))}
    </div>
  );
}
