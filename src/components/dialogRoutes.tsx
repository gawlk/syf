import routes from '~solid-pages'

import Dialog, { type CustomDialogButtonProps } from './dialog'
import Icon from './icon'
import Link from './link'

interface Props {
  button?: CustomDialogButtonProps
}

export default (props: Props) => {
  const location = useLocation()

  const buttonProps = mergeProps(props.button, {
    full: props.button?.text ? false : props.button?.full ?? true,
    svg: props.button?.text ? undefined : IconTablerArrowsExchange,
  })

  const convertRoute = (
    route: SolidAppRouter.RouteDefinition,
    parentPath?: string
  ): string[] => {
    let path = parentPath ? `${parentPath}` : ''

    if (route.path && typeof route.path === 'string') {
      path += `/${route.path.replaceAll('/', '')}`
    }

    if (!route.children) {
      return [path]
    } else if (Array.isArray(route.children)) {
      return route.children.map((route) => convertRoute(route, path)).flat()
    } else {
      console.error(route)
      return []
    }
  }

  const urls = routes
    .map((route) => convertRoute(route))
    .flat()
    .filter((url) => !url.includes(':') && url !== location.pathname)
    .sort()

  return (
    <Dialog id="routes" title="Routes" button={buttonProps}>
      <div class="space-y-2">
        <For each={urls}>
          {(url) => (
            <Link href={url} full>
              <span class="flex flex-1 items-center space-x-2 self-baseline">
                <For
                  each={url
                    .substring(1)
                    .split('/')
                    .map((word) =>
                      word ? word[0].toUpperCase() + word.substring(1) : 'Home'
                    )}
                >
                  {(word) => (
                    <>
                      <Icon
                        icon={IconTablerMinusVertical}
                        class="rotate-[30deg]"
                      />
                      {word}
                    </>
                  )}
                </For>
              </span>
            </Link>
          )}
        </For>
      </div>
    </Dialog>
  )
}
