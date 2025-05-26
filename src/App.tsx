import './App.scss'
import Content from './components/content/content'
import Section from './components/sections/Section'

const datas = [
  {
    children: <Content />,
    asset: '/assets/bg.jpg',
    theme: {
      '--color-background': '#0D1117',
      '--color-primary': '#58A6FF',
      '--color-secondary': '#1F6FEB',
      '--color-accent': '#D2A8FF',
      '--color-text': '#C9D1D9',
      '--color-card': '#161B22',
      '--color-shadow': 'rgba(88, 166, 255, 0.4)'
    }
  },
  {
    children: <Content />,
    asset: '/assets/bg2.jpg',
    theme: {
      '--color-background': '#3f5025',
      '--color-primary': '#6f884f',
      '--color-secondary': '#b89b62',
      '--color-accent': '#5e2d1c',
      '--color-text': '#f3f3e9',
      '--color-card': '#726d50',
      '--color-shadow': 'rgba(111, 136, 79, 0.4)'
    }
  }
]


function App() {

  return (
    <div className='app'>
      {datas.map((d, i) => {
        return (
          <Section key={`sec-${i}`} data={d}>
            {d.children}
          </Section>
        )
      })}
    </div>
  )
}

export default App
