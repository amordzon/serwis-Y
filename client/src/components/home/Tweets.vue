<template>
  <div>
    <div class="flex flex-shrink-0 p-4 pb-0">
      <a class="flex-shrink-0 group block" target="_blank">
        <div class="flex items-center">
          <div>
            <img
              class="inline-block h-10 w-10 rounded-full"
              src="https://kis.agh.edu.pl/wp-content/uploads/2021/01/default-avatar-300x300.jpg"
              alt=""
            />
          </div>
          <div class="ml-3">
            <p class="text-base font-medium text-white">
              Ola M
              <span class="text-sm font-medium text-gray-400">
                @Ola · 5 Jan
              </span>
            </p>
          </div>
        </div>
      </a>
    </div>
    <div class="pl-16 pr-4">
      <p class="text-base width-auto font-light text-white">
        Lorem, ipsum dolor sit amet consectetur elit. Voluptate, dolores. Non
        eaque quasi reprehenderit provident magni nulla placeat qui ratione
        ipsum dolor. Hic vitae adipisci quia similique reprehenderit libero
        aliquid.
      </p>

      <div class="flex">
        <div class="w-full">
          <div class="flex items-center">
            <div class="flex-1 text-center">
              <a
                class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                target="_blank"
              >
                <font-awesome-icon
                  icon="fa-regular fa-comment"
                  class="text-center h-5 w-5 mr-2"
                />
                12
              </a>
            </div>

            <div class="flex-1 text-center py-2 m-2">
              <a
                class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                target="_blank"
              >
                <font-awesome-icon
                  icon="fa-solid fa-retweet"
                  class="text-center h-5 w-5 mr-2"
                />
                3
              </a>
            </div>

            <div class="flex-1 text-center py-2 m-2">
              <a
                class="group flex items-center text-gray-500 px-3 py-2 text-base font-light rounded-full"
                target="_blank"
              >
                <font-awesome-icon
                  icon="fa-solid fa-chart-simple"
                  class="text-center h-5 w-5 mr-2"
                />
                100
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="border-gray-700" />
  </div>
</template>

<script>
export default {
  name: "TweetsComponent",
};
</script>
