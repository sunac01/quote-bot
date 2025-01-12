module.exports = async (ctx) => {
  let user

  if (!ctx.session.userInfo) {
    user = await ctx.db.User.findOne({ telegram_id: ctx.from.id })
  } else {
    user = ctx.session.userInfo
  }

  const now = Math.floor(new Date().getTime() / 1000)

  if (!user) {
    user = new ctx.db.User()
    user.telegram_id = ctx.from.id
    user.first_act = now
  }
  user.first_name = ctx.from.first_name
  user.last_name = ctx.from.last_name
  user.full_name = `${ctx.from.first_name}${ctx.from.last_name ? ` ${ctx.from.last_name}` : ''}`
  user.username = ctx.from.username
  user.updatedAt = new Date()

  if (ctx.chat.type === 'private') user.status = 'member'

  ctx.session.userInfo = user

  if (ctx.session.userInfo.settings.locale) {
    ctx.i18n.locale(ctx.session.userInfo.settings.locale)
  } else if (ctx.i18n.languageCode !== '-' && ctx.chat.type === 'private') {
    ctx.session.userInfo.settings.locale = ctx.i18n.shortLanguageCode
  } else if (ctx.i18n.languageCode === '-' && ctx.chat.type !== 'private') {
    ctx.i18n.locale('en')
  }

  return true
}
