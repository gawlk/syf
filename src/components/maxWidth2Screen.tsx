interface Props extends SolidJS.ParentProps {
  class?: string
}

export default (props: Props) => {
  return (
    <div class="px-6 md:px-10 xl:px-20">
      <div
        class={[props.class || '', 'mx-auto max-w-screen-2xl space-y-8 '].join(
          ' '
        )}
      >
        {props.children}
      </div>
    </div>
  )
}
