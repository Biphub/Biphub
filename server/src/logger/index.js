import tracer from 'tracer'

const logger = tracer.console(
  {
    format: '{{timestamp}} <{{title}}> {{message}}',
    dateformat : 'HH:MM:ss.L'
  }
)

export default logger
