interface LandmarkImagesProps {
  images: string[];
  name?: string;
}

export default function LandmarkImages({ images, name }: LandmarkImagesProps) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Where is this landmark?</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={name ? `${name} ${idx + 1}` : `Landmark ${idx + 1}`}
            style={{
              width: "300px",
              height: "200px",
              objectFit: "cover",
              border: "1px solid #ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}
