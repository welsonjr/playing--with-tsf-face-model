import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { atom, useAtom } from 'jotai'
import { useRef } from 'react';
import { drawMouth } from './drawing-util';
import './App.css';
import '@tensorflow/tfjs-backend-webgl';



const imageAtom = atom(null);
const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'mediapipe', //'mediapipe', // or 'tfjs'
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
  maxFaces: 2,
  refineLandmarks: true
}


const detectorAtom = atom(async (get) => await faceLandmarksDetection.createDetector(model, detectorConfig));

function App() {
  const drawArea = useRef(null);
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const [image, setImage] = useAtom(imageAtom);
  const [detector] = useAtom(detectorAtom);

  const clearDrawArea = () => {
    const ctx = drawArea.current.getContext('2d');
    ctx.clearRect(0, 0, drawArea.current.width, drawArea.current.height);
  };
  
  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        clearDrawArea();
        setImage(e.target.result);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const detectFaces = async (e) => {
    e.preventDefault();
    if(detector && image){
      const predictions = await detector.estimateFaces(imgRef.current);
      console.log(predictions);
      drawArea.current.width = imgRef.current.width;
      drawArea.current.height = imgRef.current.height;
      const ctx = drawArea.current.getContext('2d');
      
      drawMouth(ctx, predictions);
    }
  }

  return (
    <div className="App">
      <form>
        <button className="pure-button pure-button-primary" onClick={e => { 
          e.preventDefault();
          fileRef.current.click();
        }}
        > Add image</button>
        <button disabled={!image} className="pure-button pure-button-primary" onClick={detectFaces}>Detect</button>
        <input type="file" name="file" accept="image/*" ref={fileRef} onChange={handleFileChange} hidden/>
      </form>
      <div className='flex'>
        <canvas className='canvas' ref={drawArea}/>
        <img className='image' src={image} alt="preview" ref={imgRef}/>
      </div>
    </div>
  );
}

export default App;
