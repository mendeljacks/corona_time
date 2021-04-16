import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Paper,
	Radio,
	RadioGroup,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	TextField,
	Typography
} from '@material-ui/core'
import {observer} from 'mobx-react-lite'
import {main_store} from './logic'
import './styles.css'

const PersonalComponent = observer(() => {
	return (
		<>
			<TextField
				value={main_store.state.age}
				onChange={e => main_store.set_state({age: e.target.value})}
				label='Age'
				type='number'
				size='small'
				variant='outlined'
			/>
			<br />
			<br />
			<FormControl component='fieldset'>
				<FormLabel component='legend'>Gender</FormLabel>
				<RadioGroup
					aria-label='gender'
					name='gender1'
					value={main_store.state.gender}
					onChange={e => main_store.set_state({gender: e.target.value})}
				>
					<FormControlLabel value='female' control={<Radio />} label='Female' />
					<FormControlLabel value='male' control={<Radio />} label='Male' />
					<FormControlLabel value='other' control={<Radio />} label='Other' />
				</RadioGroup>
			</FormControl>
		</>
	)
})

const GeographicComponent = observer(() => {
	return (
		<>
			{main_store.state.location && (
				<iframe
					title='address'
					width='500'
					height='250'
					frameBorder={'0'}
					style={{border: 0}}
					src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCq8m13dM4V85UPUX9d7Id9NkighWE9r2M&q=${main_store.state.location}`}
					allowFullScreen
				></iframe>
			)}

			<span style={{display: 'grid', gridTemplateColumns: 'auto 100px', gap: '5px'}}>
				<TextField
					label='Address'
					value={main_store.state.address}
					onChange={e => main_store.set_state({address: e.target.value})}
					size='small'
					variant='outlined'
				/>

				<Button
					variant='outlined'
					onClick={async () => {
						const country = await main_store.detect_country(main_store.state.address)
						main_store.set_state({
							location: main_store.state.address,
							country
						})
					}}
				>
					Locate
				</Button>
			</span>
			<Typography>Country: {main_store.state.country}</Typography>
		</>
	)
})

const MedicalComponent = observer(() => {
	return (
		<FormGroup>
			<FormControlLabel
				value='start'
				control={
					<Checkbox
						checked={main_store.state.lung_problems}
						onChange={e => main_store.set_state({lung_problems: e.target.checked})}
					/>
				}
				label='Do you have respiratory or lung problems?'
				labelPlacement='start'
			/>
			<FormControlLabel
				value='start'
				control={
					<Checkbox
						checked={main_store.state.heart_problems}
						onChange={e => main_store.set_state({heart_problems: e.target.checked})}
					/>
				}
				label='Do you have circulation or heart problems?'
				labelPlacement='start'
			/>
		</FormGroup>
	)
})

export const Main = observer(() => {
	const steps = ['Personal Factors', 'Geographic Factors', 'Medical Factors']
	return (
		<div>
			<Stepper
				className='container'
				activeStep={main_store.state.active_step}
				orientation='vertical'
			>
				{main_store.state.risk === undefined ? (
					steps.map((label, index) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
							<StepContent>
								{index === 0 && <PersonalComponent />}
								{index === 1 && <GeographicComponent />}
								{index === 2 && <MedicalComponent />}

								<div>
									<div>
										<Button
											disabled={main_store.state.active_step === 0}
											onClick={() =>
												main_store.set_state({active_step: main_store.state.active_step - 1})
											}
										>
											Back
										</Button>
										<Button
											variant='contained'
											color='primary'
											onClick={() => {
												if (index === steps.length - 1) {
													main_store.calculate_risk()
												} else {
													main_store.set_state({active_step: index + 1})
												}
											}}
										>
											{main_store.state.active_step === steps.length - 1 ? 'Finish' : 'Next'}
										</Button>
									</div>
								</div>
							</StepContent>
						</Step>
					))
				) : (
					<div
						style={{
							display: 'grid',
							placeItems: 'center',
							height: '100%',
							textAlign: 'center',
							padding: '20px',
							gap: '15px'
						}}
					>

                        {
                            main_store.state.risk >= 8 ?
                            <Typography variant='h4' style={{color: 'indianred'}}>Self Isolation recommended!</Typography>
                            : main_store.state.risk >=5 ?
                            <Typography variant='h4' style={{color: 'blue'}}>Go out but wear a mask</Typography> :
                            <Typography variant='h4' style={{color: 'black'}}>Live your life :)</Typography>
                        }

						<Button
							variant='outlined'
							fullWidth
							onClick={() => main_store.set_state({risk: undefined, active_step: 0})}
						>
							Back
						</Button>
					</div>
				)}
			</Stepper>
			{main_store.state.active_step === steps.length && (
				<Paper square elevation={0}>
					<Typography>All steps completed - you&apos;re finished</Typography>
					<Button onClick={() => {}}>Reset</Button>
				</Paper>
			)}
		</div>
	)
})
