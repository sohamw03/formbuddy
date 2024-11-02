import styles from "./Toolbar.module.css";
export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInWrapper}>
        <div>100%
          {/* https://imagekit.io/blog/image-cropping-in-react-application */}
        </div>
        <div>1920 x 1080</div>
        <div>Crop
          {/* https://valentinh.github.io/react-easy-crop */}
        </div>
      </div>
    </div>
  );
}
