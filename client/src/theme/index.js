import settings from '../settings'
import defaultTheme from './defaultTheme'

const getTheme = (theme = 'default') => {
  if (theme === 'default') {
    return defaultTheme
  }
}

export default getTheme(settings.theme)
