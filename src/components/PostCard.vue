<template>
    <div class="postCard">
        <div class="header">
            <h1>
                {{ props.cardTitle }}
            </h1>
        </div>
        <div class="info">{{ props.cardInfo }}</div>
        <div class="author">{{ props.cardAuthor }}</div>
    </div>
</template>

<script setup>

const props = defineProps({
    cardTitle: String,
    cardInfo: String,
    cardAuthor: String
})

</script>

<style scoped lang="scss">
.postCard {
    width: 390px;
    box-shadow: 0px 0px 8px rgb(104, 103, 103);
    background-color: white;
    padding: 6px;
    text-align: left;
    border-radius: 3px;

    @media (max-width: 600px) {
        width: fit-content;
    }
}

.header {
    width: 100%;
    color: rgb(113, 113, 236);
    font-size: 0.5rem;
    text-transform: uppercase;
    margin-bottom: 5px;
}

.info {
    &::first-letter{
        text-transform: uppercase;
    }
}

.author {
    color: rgb(100, 82, 82);
    margin-top: 8px;
    font-size: 13px;
}

</style>