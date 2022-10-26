import {
  BoxGeometry,
  Camera,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'
import { getImgSrc } from '../utils/utils'

export class Application {
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private stats: Stats
  private controls: OrbitControls

  constructor() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.renderer = new WebGLRenderer({
      antialias: true, // 抗锯齿
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    window.addEventListener('resize', this.onWindowResize, false)

    // 加载图片材质
    const textureLoader = new TextureLoader()
    const boxTexture = textureLoader.load(getImgSrc('box', 'jpg'))

    // 几何图形
    const boxGeometry = new BoxGeometry(1, 1, 1)
    // 贴图
    const meshBasicMaterial = new MeshBasicMaterial({
      map: boxTexture,
      side: DoubleSide,
    })
    // 网格
    const mesh = new Mesh(boxGeometry, meshBasicMaterial)
    // 设置网格名称, 方便后续获取
    mesh.name = 'box'

    const skyboxGeometry = new BoxGeometry(200, 200, 200)
    const skyboxMaterials = [
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/rt')),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/lf')),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/up')),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/dn')),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/bk')),
        side: DoubleSide,
      }),
      new MeshBasicMaterial({
        map: textureLoader.load(getImgSrc('skybox/ft')),
        side: DoubleSide,
      }),
    ]
    const skyboxMesh = new Mesh(skyboxGeometry, skyboxMaterials)
    skyboxMesh.name = 'skyboxMesh'

    // 设置相机位置
    this.camera.position.set(0, 0, 5)

    // 添加到舞台
    this.scene.add(mesh)
    this.scene.add(skyboxMesh)

    // 添加性能监控
    this.stats = new Stats()
    this.stats.showPanel(0)
    document.body.appendChild(this.stats.dom)

    // 添加鼠标控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // 渲染
    this.render()
  }

  private onWindowResize = () => {
    // 监听resize, 重置renderer的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    // 重置相机的宽高比
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  private render() {
    this.stats.begin()
    // 浏览器刷新
    window.requestAnimationFrame(() => this.render())

    // 旋转
    const skyboxMesh = this.scene.getObjectByName('skyboxMesh') as Mesh
    skyboxMesh.rotation.y += 0.001

    //  reuqired if controls.enableDamping or controls.autoRotate are set to true
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.stats.end()
  }
}
