<script>
	import axios from "axios";
	import { onMount } from "svelte";
	import UrlBox from "./UrlBox.svelte";
	import { flip } from "svelte/animate";
	import { fade, fly } from "svelte/transition";

	let url;
	let urls = [];
	$: errorMessage = "";
	$: isValid = false;
	$: userToken =
		localStorage.getItem("urlShortenerToken") !== null
			? localStorage.getItem("urlShortenerToken")
			: undefined;

	onMount(async () => {
		if (localStorage.getItem("urlShortenerToken") !== null) {
			try {
				const response = await axios.get(
					`http://localhost:8080/get-urls/${userToken}`
				);
				urls = response.data;
			} catch (error) {
				console.log(error.response);
			}
		}
	});

	const postData = async () => {
		isValid = false;
		if (url === undefined || url.length === 0) {
			isValid = true;
			errorMessage = "You must enter a url";
			return;
		}

		try {
			const response = await axios.post("http://localhost:8080/add-url", {
				url,
				userToken,
			});
			urls = [response.data, ...urls];

			if (userToken === undefined) {
				localStorage.setItem(
					"urlShortenerToken",
					response.data.userToken
				);
			}
		} catch (error) {
			isValid = true;
			errorMessage = error.response.data.message;
		}

		url = "";
	};
</script>

<main class="container">
	<div class="titleBox">
		<h1>Moumouche Shortener</h1>
	</div>
	<div class="inputBox">
		<input
			type="url"
			placeholder="Paste your moumouche here"
			class="input"
			bind:value={url}
		/><button class="button ripple" on:click={postData}>Submit</button>
		{#if isValid}
			<p
				class="errorMessage"
				transition:fly={{ duration: 500, x: -200 }}
			>{errorMessage}</p>
		{/if}
	</div>
	{#each urls as url (url.token)}
		<div animate:flip class="urlsBox" transition:fade={{ duration: 2000 }}>
			<UrlBox
				oldUrl={url.url}
				newUrl="http://localhost:8080/{url.token}"
				date={url.createdAt}
				hostname={url.hostname}
			/>
		</div>
	{/each}
</main>

<style>
	:global(body) {
		background-color: #fcf6f5ff;
	}

	.urlsBox {
		border: 2px #89abe3ff solid;
		width: 33%;
		margin: 2rem;
		padding: 1.1rem;
		border-radius: 8px;
	}

	@media (max-width: 1200px) {
		.urlsBox {
			width: 60%;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.urlsBox {
			width: 90%;
			font-size: 0.8rem;
		}
	}

	.errorMessage {
		color: crimson;
		font-weight: bold;
	}

	main {
		margin: 0, auto;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.titleBox {
		margin: 10px;
		color: #1e3d59;
		text-align: center;
	}

	.inputBox {
		color: #a3a3a3;
		height: 7%;
		width: 33%;
	}
	.input {
		border: 2px #89abe3ff solid;
		border-radius: 5px 0 0 5px;
		height: 100%;
		width: 80%;
		margin: 0;
		outline: none;
	}

	.button {
		width: 20%;
		height: 100%;
		background-color: #89abe3ff;
		border: 2px rgba(0, 0, 0, 0) solid;
		border-radius: 0 5px 5px 0;
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

	@media (max-width: 1200px) {
		.inputBox {
			width: 60%;
			font-size: 0.9rem;
		}
		.button {
			width: 25%;
		}
		.input {
			width: 75%;
		}
	}

	@media (max-width: 480px) {
		.inputBox {
			width: 90%;
			font-size: 0.8rem;
		}
	}
</style>
