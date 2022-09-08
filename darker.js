onload = () => {
	const banners = [
		...document.querySelectorAll('a > img[src]'),
		...document.querySelectorAll('td > img[align="absmiddle"]')
	]

	for(const banner of banners) {
		// skip the qrcode image
		// cuz mingdao doesn't set CORS header from the origin, so we can't replace that :(
		if(banner.src.includes("images/app.png") || banner.src.includes("stu_photo"))
			continue
		
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		const image = new Image()

		image.onload = () => {
			canvas.width = image.width
			canvas.height = image.height

			ctx.drawImage(image, 0, 0)

			try {
				const raw = ctx.getImageData(0, 0, image.width, image.height)
				const data = raw.data
				
				for(let i = 0; i < data.length; i += 4) {
					// replace all "close to" white's color
					if(data[i] >= 200 && data[i + 1] >= 200 && data[i + 2] >= 200) {
						data[i] = 0
						data[i + 1] = 0
						data[i + 2] = 0
					}
				}
				
				ctx.clearRect(0, 0, image.width, image.height)
				ctx.putImageData(raw, 0, 0)
				
				banner.src = canvas.toDataURL("image/png")
			} catch (e) {
				console.log(`Error replacing ${banner.src} color :(`)
				console.error(e)
			}
		}
		
		image.src = banner.src
	}
}