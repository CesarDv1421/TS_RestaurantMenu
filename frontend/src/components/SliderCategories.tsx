import { useEffect, useState } from 'react';

//React Slick - libreria para crear sliders
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface categories {
  id: number;
  categoria: string;
}

interface ChildrenProps {
  categories: categories[];
  setDisplayedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const SliderCategories: React.FC<ChildrenProps> = ({ categories, setDisplayedCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState('Menu');

  useEffect(() => setDisplayedCategory(selectedCategory), [selectedCategory]);

  const onClickToggle = (categoria: string) =>
    setSelectedCategory((prevCategory) => (prevCategory === categoria ? 'Menu' : categoria));

  const sliderSettings = {
    className: 'text-center m-10',
    dots: false, // Muestra los puntos de navegación
    infinite: true, // Permite el desplazamiento infinito
    speed: 500, // Velocidad de la animación en milisegundos
    slidesToShow: 6, // Cantidad de slides mostrados a la vez
    slidesToScroll: 1, // Cantidad de slides a desplazar al avanzar o retroceder
    autoplay: true, // Reproducción automática
    autoplaySpeed: 3000, // Velocidad de la reproducción automática en milisegundos
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Slider {...sliderSettings}>
      {categories.length > 0 && (
        <div>
          <button
            className={`px-5 py-2 rounded-2xl border-[2px] border-green-500 transition-all ${
              selectedCategory === 'Menu' ? 'bg-green-500 text-white' : 'bg-opacity-20'
            }`}
            onClick={() => onClickToggle('Menu')}
          >
            Menu
          </button>
        </div>
      )}
      {categories?.map(({ id, categoria }) => (
        <div key={id}>
          <button
            className={`px-5 py-2 rounded-2xl border-[2px] border-green-500 transition-all ${
              selectedCategory === categoria ? 'bg-green-500 text-white' : 'bg-opacity-20'
            }`}
            onClick={() => onClickToggle(categoria)}
          >
            {categoria}
          </button>
        </div>
      ))}
    </Slider>
  );
};

export default SliderCategories;
