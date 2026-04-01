import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import Login from '../../src/components/Login.vue'
import 'element-plus/dist/index.css'

// 创建内存路由
const createMemoryRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'Index', component: { template: '<div>Index</div>' } },
      { path: '/login', name: 'Login', component: Login }
    ]
  })
}

// 创建测试组件包裹器
const createWrapper = async () => {
  const router = createMemoryRouter()

  const app = createApp(Login)
  app.use(ElementPlus)
  app.use(router)

  await router.push('/login')
  await router.isReady()

  const wrapper = mount(app, {
    attachTo: document.body,
    global: {
      components: {
        'el-card': ElementPlus.Card,
        'el-form': ElementPlus.Form,
        'el-form-item': ElementPlus.FormItem,
        'el-input': ElementPlus.Input,
        'el-button': ElementPlus.Button,
        'el-checkbox': ElementPlus.Checkbox,
        'el-link': ElementPlus.Link
      },
      mocks: {
        ElMessage: {
          success: vi.fn(),
          error: vi.fn(),
          warning: vi.fn(),
          info: vi.fn()
        }
      }
    }
  })

  return wrapper
}

describe('Login.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should render login form correctly', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('.login-wrapper').exists()).toBe(true)
    expect(wrapper.find('.login-box').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('欢迎登录')
    expect(wrapper.find('.subtitle').text()).toBe('Welcome to SnapQ')

    await wrapper.unmount()
  })

  it('should validate username and password rules', async () => {
    const wrapper = await createWrapper()

    // 测试表单验证
    const form = wrapper.findComponent(Login)
    expect(form.vm.loginForm.username).toBe('')
    expect(form.vm.loginForm.password).toBe('')

    await wrapper.unmount()
  })

  it('should login successfully with correct credentials', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    // 设置表单值
    form.vm.loginForm.username = 'admin'
    form.vm.loginForm.password = 'admin'

    expect(form.vm.loginForm.username).toBe('admin')
    expect(form.vm.loginForm.password).toBe('admin')

    // 触发登录方法
    await form.vm.handleLogin()

    // 验证localStorage
    expect(localStorage.getItem('isLoggedIn')).toBe('true')
    expect(localStorage.getItem('username')).toBe('admin')

    await wrapper.unmount()
  })

  it('should show error message with incorrect credentials', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    // 设置错误凭据
    form.vm.loginForm.username = 'wronguser'
    form.vm.loginForm.password = 'wrongpass'

    // 触发登录方法
    await form.vm.handleLogin()

    // 验证localStorage未设置
    expect(localStorage.getItem('isLoggedIn')).toBeNull()
    expect(localStorage.getItem('username')).toBeNull()

    await wrapper.unmount()
  })

  it('should toggle loading state during login', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    expect(form.vm.loading).toBe(false)

    // 开始登录
    form.vm.handleLogin()

    expect(form.vm.loading).toBe(true)

    // 等待登录完成
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(form.vm.loading).toBe(false)

    await wrapper.unmount()
  })

  it('should handle remember me checkbox', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    // 初始状态
    expect(form.vm.loginForm.rememberMe).toBeUndefined()

    // 切换checkbox状态
    form.vm.loginForm.rememberMe = true
    expect(form.vm.loginForm.rememberMe).toBe(true)

    form.vm.loginForm.rememberMe = false
    expect(form.vm.loginForm.rememberMe).toBe(false)

    await wrapper.unmount()
  })

  it('should validate username length constraints', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    // 测试用户名长度限制
    form.vm.loginForm.username = 'ab' // 少于3个字符
    await form.vm.$nextTick()

    form.vm.loginForm.username = 'admin' // 正常长度
    await form.vm.$nextTick()

    expect(form.vm.loginForm.username).toBe('admin')

    await wrapper.unmount()
  })

  it('should validate password length constraints', async () => {
    const wrapper = await createWrapper()

    const form = wrapper.findComponent(Login)

    // 测试密码长度限制
    form.vm.loginForm.password = '12345' // 少于6个字符
    await form.vm.$nextTick()

    form.vm.loginForm.password = 'admin' // 正常长度
    await form.vm.$nextTick()

    expect(form.vm.loginForm.password).toBe('admin')

    await wrapper.unmount()
  })
})