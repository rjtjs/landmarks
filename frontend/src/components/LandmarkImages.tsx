import styles from "./LandmarkImages.module.css";

interface LandmarkImagesProps {
  images: string[];
  name?: string;
}

export default function LandmarkImages({ images, name }: LandmarkImagesProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Where is this landmark?</h2>
      <div className={styles.imagesContainer}>
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={name ? `${name} ${idx + 1}` : `Landmark ${idx + 1}`}
            className={styles.image}
          />
        ))}
      </div>
    </div>
  );
}
