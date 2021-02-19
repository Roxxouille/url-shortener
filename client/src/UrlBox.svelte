<script>
    export let newUrl;
    export let oldUrl;
    export let date;
    export let hostname;

    let dateToShow = new Date(date);
    let userLang = navigator.language ?? navigator.userLanguage;

    const handleCopy = () => {
        navigator.clipboard.writeText(newUrl);
    };
</script>

<div>
    <div class="previousUrl">
        <div class="previousUrlLeft">
            <h3 class="urlTitle">{hostname}</h3>
            <a class="oldUrl" href={oldUrl}>{oldUrl}</a>
        </div>
        <div class="previousUrlRight">
            <p>
                {dateToShow.toLocaleDateString(userLang, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </div>
    </div>
    <div class="newUrl">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href={newUrl} class="newLink">{newUrl}</a>
        <button class="copyButton ripple" on:click={handleCopy}
            >Copy Moumouche</button
        >
    </div>
</div>

<style>
    .previousUrl {
        border-bottom: 2px #89abe3ff solid;
        padding: 10px;
        display: flex;
        justify-content: space-between;
    }

    .previousUrlLeft {
        width: 50%;
    }
    .previousUrlRight {
        width: 50%;
        text-align: end;
    }

    .urlTitle {
        margin: 0;
    }

    .newUrl {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    .newLink {
        font-size: 0.9rem;
        margin-right: 2px;
    }

    .copyButton {
        background-color: #89abe3ff;
        border: 2px rgba(0, 0, 0, 0) solid;
        border-radius: 2px;
        margin: 0;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }

    .ripple {
        background-position: center;
        transition: background 0.8s;
    }

    .ripple:hover {
        background: #008dd4 radial-gradient(circle, transparent 1%, #008dd4 1%)
            center/15000%;
    }

    .ripple:active {
        background-color: #6eb9f7;
        background-size: 100%;
        transition: background 0s;
    }

    .oldUrl {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        max-width: 35ch;
        text-overflow: ellipsis;
    }
</style>
