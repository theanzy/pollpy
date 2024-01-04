<script lang="ts">
	import createPopperAction from '$lib/popover';
	import { cn } from '$lib/utils';
	import {
		getMonth,
		getYear,
		format,
		eachDayOfInterval,
		endOfMonth,
		getDay,
		startOfWeek,
		endOfWeek,
		isSameDay,
		addDays,
		subDays,
		setMinutes,
		setHours
	} from 'date-fns';

	type SelectMode = 'day' | 'month' | 'year';
	export let required = false;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;

	let selectMode: SelectMode = 'day';
	let now = new Date();
	let month = getMonth(now);
	let year = getYear(now);
	$: days = eachDayOfInterval({
		start: startOfWeek(new Date(year, month, 1)),
		end: endOfWeek(endOfMonth(new Date(year, month, 1)))
	});

	let months = Array.from({ length: 12 }, (d, i) => {
		return i;
	});

	$: years = Array.from({ length: 12 }, (d, i) => {
		return i + Math.floor(year / 12) * 12;
	});

	const colStart = {
		0: '',
		1: 'col-start-2',
		2: 'col-start-3',
		3: 'col-start-4',
		4: 'col-start-5',
		5: 'col-start-6',
		6: 'col-start-7'
	} as Record<number, string>;

	let selectedDay: Date | null = null;

	let hours = Array.from({ length: 12 }, (_, i) => {
		return i + 1;
	});
	let minutes = Array.from({ length: 60 }, (_, i) => {
		return i;
	});

	let meridiems = ['AM', 'PM'];

	let selectedHour: number | null = null;
	let selectedMinute: number | null = null;
	let selectedMeridiem = 'AM';

	let datetime: Date | null = null;

	$: if (!required) {
		datetime = null;
	}

	$: {
		if (selectedDay !== null && selectedHour !== null && selectedMinute !== null) {
			let d = new Date(selectedDay);
			const hour = selectedMeridiem === 'AM' ? selectedHour : selectedHour + (12 % 24);
			d = setHours(d, hour);
			d = setMinutes(d, selectedMinute);
			datetime = d;
		}
	}

	let pickerOpen = false;
	const [usePopperTrigger, usePopperContent] = createPopperAction();

	function toPrevious() {
		if (selectMode === 'day') {
			toPreviousMonth();
		} else if (selectMode === 'month') {
			year -= 1;
		} else {
			year = years[0] - 1;
		}
	}

	function toPreviousMonth() {
		const day = days[0];
		const prev = subDays(day, 1);
		month = getMonth(prev);
		year = getYear(prev);
	}

	function toNext() {
		if (selectMode === 'day') {
			toNextMonth();
		} else if (selectMode === 'month') {
			year += 1;
		} else {
			year = years[years.length - 1] + 1;
		}
	}
	function toNextMonth() {
		const day = days[days.length - 1];
		const next = addDays(day, 1);
		month = getMonth(next);
		year = getYear(next);
	}
</script>

<input
	{id}
	{name}
	hidden
	value={datetime?.toISOString() || null}
	on:invalid={(e) => {
		e.preventDefault();
	}}
	{required}
	class="peer"
/>
<button
	use:usePopperTrigger
	on:click={() => {
		pickerOpen = !pickerOpen;
	}}
	type="button"
	class="px-3 py-2 w-full text-left outline-none cursor-default transition focus-visible:ring-1 ring-offset-2 ring-offset-surface-950 ring-primary-600 rounded-sm bg-surface-700 peer-invalid:ring-1 peer-invalid:ring-red-600"
>
	{#if datetime}
		<p>{datetime?.toLocaleString()}</p>
	{:else}
		<p class="text-surface-300">Select date time</p>
	{/if}
</button>
{#if pickerOpen}
	<div
		use:usePopperContent={{
			onClickOutside() {
				pickerOpen = false;
			},
			params: {
				placement: 'bottom',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 5]
						}
					}
				]
			}
		}}
		class="bg-neutral-900 p-2 rounded shadow max-w-max text-sm flex flex-row gap-3 select-none z-10"
	>
		<div>
			<div class="flex flex-row justify-between py-2">
				<button
					aria-label="to previous month"
					on:click={toPrevious}
					type="button"
					class="grid place-items-center text-neutral-300 enabled:hover:text-white enabled:hover:bg-neutral-700 w-6 h-6 rounded-full"
				>
					<svg
						class="w-4 h-4"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 256 256"
						><path
							fill="currentColor"
							d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"
						/></svg
					>
				</button>
				{#if selectMode === 'day'}
					<button
						type="button"
						class="outline-none transition px-1 enabled:hover:bg-neutral-700 rounded"
						aria-label="select month"
						on:click={() => {
							if (selectMode === 'day') {
								selectMode = 'month';
							} else {
								selectMode = 'day';
							}
						}}
					>
						<time>{format(new Date(year, month, 1), 'MMMM yyyy')}</time>
					</button>
				{:else if selectMode === 'month'}
					<button
						type="button"
						class="outline-none transition px-1 enabled:hover:bg-neutral-700 rounded"
						aria-label="select month"
						on:click={() => {
							if (selectMode === 'month') {
								selectMode = 'year';
							} else {
								selectMode = 'month';
							}
						}}
					>
						<time>{format(new Date(year, month, 1), 'yyyy')}</time>
					</button>
				{:else}
					<button
						type="button"
						class="outline-none transition px-1 enabled:hover:bg-neutral-700 rounded"
						aria-label="select month"
						on:click={() => {
							if (selectMode === 'month') {
								selectMode = 'year';
							} else {
								selectMode = 'month';
							}
						}}
					>
						<time>{years[0]} - {years[years.length - 1]}</time>
					</button>
				{/if}
				<button
					aria-label="to next month"
					type="button"
					class="grid place-items-center text-neutral-300 enabled:hover:text-white enabled:hover:bg-neutral-700 w-6 h-6 rounded-full"
					on:click={toNext}
				>
					<svg
						class="w-4 h-4"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 256 256"
						><g transform="translate(256 0) scale(-1 1)"
							><path
								fill="currentColor"
								d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"
							/></g
						></svg
					>
				</button>
			</div>
			{#if selectMode === 'day'}
				<div class="grid text-neutral-200 w-60 h-60">
					<span class="flex items-center justify-center">Su</span>
					<span class="flex items-center justify-center grid-cols-2">Mo</span>
					<span class="flex items-center justify-center grid-cols-3">Tu</span>
					<span class="flex items-center justify-center grid-cols-4">We</span>
					<span class="flex items-center justify-center grid-cols-5">Th</span>
					<span class="flex items-center justify-center grid-cols-6">Fr</span>
					<span class="flex items-center justify-center grid-cols-7">Sa</span>
					{#each days as day (day.toString())}
						{@const dayofweek = getDay(day)}
						<button
							type="button"
							class={cn(
								'text-neutral-50 w-8 h-8 rounded-full transition outline-none focus-visible:bg-neutral-700 focus-visible:text-white',
								'enabled:hover:bg-neutral-700 enabled:hover:text-white',
								colStart[dayofweek],
								getMonth(day) !== month && 'text-neutral-600',
								selectedDay && isSameDay(day, selectedDay) && 'bg-sky-600'
							)}
							on:click={() => {
								month = getMonth(day);
								year = getYear(day);
								selectedDay = day;
							}}
						>
							{day.getDate()}
						</button>
					{/each}
				</div>
			{:else if selectMode === 'month'}
				<div class="grid grid-cols-3 w-60 h-60 gap-2">
					{#each months as m}
						<button
							type="button"
							class="grid rounded place-items-center transition {month === m
								? 'bg-sky-600'
								: 'hover:bg-neutral-700'}"
							on:click={() => {
								month = m;
								selectMode = 'day';
								selectedDay = null;
							}}
						>
							{format(new Date(1999, m, 1), 'MMM')}
						</button>
					{/each}
				</div>
			{:else if selectMode === 'year'}
				<div class="grid grid-cols-3 w-60 h-60 gap-2">
					{#each years as y}
						<button
							type="button"
							class="grid rounded place-items-center transition {year === y
								? 'bg-sky-600'
								: 'hover:bg-neutral-700'}"
							on:click={() => {
								year = y;
								selectMode = 'month';
							}}
						>
							{format(new Date(y, 1, 1), 'yyyy')}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="flex flex-row gap-1">
			<div>
				<p class="text-center font-medium text-neutral-500 py-1">HH</p>
				<div class="h-full overflow-hidden relative max-h-60 w-8">
					<div
						class="absolute flex flex-col overflow-y-scroll inset-0 right-[-4px] md:right-[-17px]"
						on:scroll={(e) => {
							const height = e.currentTarget.scrollHeight;

							if (e.currentTarget.scrollTop === 0) {
								e.currentTarget.scroll({
									top: height * 0.45
								});
							} else if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= height) {
								e.currentTarget.scroll({
									top: height * 0.2
								});
							}
						}}
					>
						{#each hours.concat(hours) as h}
							<button
								type="button"
								on:click={(e) => {
									selectedHour = h;
									const parent = e.currentTarget.parentElement;
									parent?.scroll({
										top: e.currentTarget.offsetTop
									});
								}}
								class="transition {selectedHour === h ? 'bg-sky-600' : 'hover:bg-neutral-700'}  p-1"
								>{h}</button
							>
						{/each}
					</div>
				</div>
			</div>
			<div>
				<p class="text-center font-medium text-neutral-500 py-1">MM</p>
				<div class="h-full overflow-hidden relative max-h-60 w-8">
					<div
						class="absolute flex flex-col overflow-y-scroll inset-0 right-[-4px] md:right-[-17px]"
						on:scroll={(e) => {
							const height = e.currentTarget.scrollHeight;
							if (e.currentTarget.scrollTop === 0) {
								e.currentTarget.scroll({
									top: height / 2.02
								});
							} else if (e.currentTarget.scrollTop + e.currentTarget.offsetHeight >= height) {
								e.currentTarget.scroll({
									top: height * 0.405
								});
							}
						}}
					>
						{#each minutes.concat(minutes) as m}
							<button
								on:click={(e) => {
									selectedMinute = m;
									const parent = e.currentTarget.parentElement;
									parent?.scroll({
										top: e.currentTarget.offsetTop
									});
								}}
								class="transition p-1 {selectedMinute === m
									? 'bg-sky-600'
									: 'hover:bg-neutral-700'}"
								type="button"
							>
								{m.toString().padStart(2, '0')}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<div class="flex flex-col justify-center gap-1">
				{#each meridiems as mm}
					<button
						type="button"
						class="transition py-1 px-2 {selectedMeridiem === mm
							? 'bg-sky-600'
							: 'hover:bg-neutral-700'}"
						on:click={() => {
							selectedMeridiem = mm;
						}}
					>
						{mm}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}
