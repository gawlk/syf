interface Props {
  url?: string
  class?: string
  lines?: string[]
}

export default (props: Props) => {
  return (
    <div class="relative flex h-screen justify-center">
      <div class="absolute flex h-screen items-center">
        <div
          class={`-z-10 -mx-[100rem] h-[80%] flex-1 bg-center bg-no-repeat sm:h-[90%] md:h-full ${
            props.class || ''
          }`}
          style={`background-image: url(${props.url});`}
        />
      </div>
      <Show when={props.lines}>
        <h2
          style="font-size: min(55vw, 30vh); font-size: min(50dvw, 25dvh);"
          class="flex h-full flex-1 flex-col items-center justify-center font-druk uppercase leading-[0.8]"
        >
          <For each={props.lines}>{(line) => <span>{line}</span>}</For>
        </h2>
      </Show>
    </div>
  )
}
