import bannerImage from "../assets/img/banner/banner.png";

function Banner() {
  return (
    <div className="w-full relative">
      <img
        src={bannerImage}
        alt="Banner"
        className="w-full h-auto object-contain"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

export default Banner;
