import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { Settings, X, Github } from 'lucide-react'
import { Squares } from './components/Squares'
import { ImageUploader } from './components/ImageUploader'
import { ColorPicker } from './components/ColorPicker'
extend({ MeshLineGeometry, MeshLineMaterial })

export default function App() {
  const [frontImage, setFrontImage] = useState('/bg.png')
  const [backImage, setBackImage] = useState('/bg2.jpeg')
  const [bandColor, setBandColor] = useState('#eeeeee')
  const [showControls, setShowControls] = useState(false)

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  return (
    <div className="w-[100%] h-[100%] md:w-[95%] md:h-[95%] m-auto absolute inset-0 border-4 border-[#d3d3d3] rounded-xl overflow-hidden">
      {showControls && (
        <>
          <ImageUploader 
            onFrontImageChange={setFrontImage}
            onBackImageChange={setBackImage}
          />
          <ColorPicker onColorChange={setBandColor} />
        </>
      )}
      
      <div className="absolute bottom-[20px] left-[20px] z-[1000] flex gap-[16px]">
        <button 
          onClick={toggleControls}
          className="bg-[#eeeeee] text-black px-[12px] py-[8px] rounded-[4px] border-none cursor-pointer flex items-center gap-[8px]"
        >
          {showControls ? <X size={24} /> : <Settings size={24} />}
        </button>

        <button 
          onClick={() => window.open('https://github.com/iamdevmarcos/3d-badge', '_blank')}
          className="bg-[#eeeeee] text-black px-[12px] py-[8px] rounded-[4px] border-none cursor-pointer flex items-center gap-[8px]"
        >
          <Github size={24} />
        </button>
      </div>
      
      <div
        className="relative w-full h-full"
      >
        <div className="absolute w-full h-full z-0">
          <Squares direction="diagonal" speed={0.5} />
        </div>

        <div className="absolute bottom-[20px] right-[20px] z-[1000] text-white">
          <h1 className="text-[16px] font-regular w-fit" style={{ letterSpacing: '-0.6px' }}>
            built by <a href="https://x.com/mendestsx" target="_blank" rel="noopener noreferrer" className="underline font-semibold underline-offset-4">marcosmendes</a>
          </h1>
        </div>

        <div className="absolute w-full h-full z-1">
          <Canvas camera={{ position: [0, 0, 13], fov: 25 }} >
            <ambientLight intensity={Math.PI} />
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
              <Band frontImage={frontImage} backImage={backImage} bandColor={bandColor} />
            </Physics>
            <Environment>
              <color attach="background" args={['black']} />
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Canvas>
        </div>
      </div>
    </div>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10, frontImage, backImage, bandColor }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  const cardFrontTexture = useTexture(frontImage)
  const cardBackTexture = useTexture(backImage)
  const bandTexture = useTexture('/back.png')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })

      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]} scale={0.65}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.40}
            position={[0, 0, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh>
              <planeGeometry args={[1.6, 2.40]} />
              <meshPhysicalMaterial 
                map={cardFrontTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
            <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshPhysicalMaterial 
                map={cardBackTexture}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} position={[0, 0.40, 0]}>
        <meshLineGeometry />
        <meshLineMaterial 
          color={bandColor}
          opacity={0.6}
          depthTest={false}
          resolution={[width, height]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
