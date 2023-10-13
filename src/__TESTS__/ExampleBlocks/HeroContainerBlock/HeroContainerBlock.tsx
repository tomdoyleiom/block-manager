import { Button, Hero, ModalButton } from '../../../../types'
import { Button as ButtonEl, Col, Container, Row } from 'react-bootstrap'
import React, { useEffect } from 'react'
import { mapColourToBg, mapColourToBorder } from '../../../../utilities/mapColours'

import Aos from 'aos'
import CmsContent from '../CmsContent/CmsContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IBlockRegistryOption } from '../..'
import ImageSection from '../../../Sections/ImageSection'
import Link from 'next/link'
import TextSection from '../../../Sections/TextSection'
import { faCog } from '@fortawesome/pro-solid-svg-icons'
import { getUrlFromLink } from '../../../../utilities/urlUtilities'
import styles from './HeroContainerBlock.module.scss'
import { useGlobalModalState } from '../../../Modals'
import { useRouter } from 'next/router'

// Add the query to the page query at ./app/src/queries.ts
export const HeroContainerBlockQuery = `
... on HeroContainer {
  id
  hero {
    id
    hash
    title
    description {
      html
    }
    boxText {
      html
    }

    backgroundImage {
      url
    }

    texture {
      url
    }

    boxColour
    styles

    colour

    button {
      ... on Button {
        __typename
        id
        link {
          ... on ExternalLink {
            id
            url
            title
          }
          ... on InternalLink {
            id
            page {
              slug
              title
            }
            title
          }
        }
        title
      }
      ... on ModalButton {
        __typename
        id
        title
        type
      }
    }
    icon {
      url
      height
      width
    }

    boxIcon {
      url
      height
      width
    }

  }
}
`
export interface IHeroContainerBlockProps {
  __typename: 'HeroContainer'
  hero: Hero[]
  id: string
}

// Add these options to the block registry at ./app/src/components/BlockManager/registry.tsx
export const HeroContainerBlockOptions: IBlockRegistryOption = {
  __typename: 'HeroContainer',
  component: (index: number, rest: IHeroContainerBlockProps) => (
    <HeroContainerBlock key={index} {...rest} />
  ),
  cols: 3
}

const HeroButton: React.FC<{ button: Button | ModalButton }> = ({ button }) => {
  const [{ contactUs }, setModalsState] = useGlobalModalState()
  if (!button) return null
  if (button.__typename === 'ModalButton') {
    return (
      <ButtonEl
        size='lg'
        variant='brand1'
        data-aos='fade-right'
        data-aos-delay='100'
        data-aos-duration='1000'
        onClick={() => contactUs.showModal()}
        className='mb-4'
      >
        {button.title}
        <FontAwesomeIcon icon={faCog} spin={true} size='1x' className='ms-1' />
      </ButtonEl>
    )
  } else {
    return (
      <>
        {button && button.link ? (
          <Link href={getUrlFromLink(button.link) ?? ''} passHref={true} legacyBehavior={true}>
            <ButtonEl
              size='lg'
              variant='brand1'
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1000'
              className='mb-4'
            >
              {button.title}
              <FontAwesomeIcon icon={faCog} spin={true} size='1x' className='ms-1' />
            </ButtonEl>
          </Link>
        ) : null}
      </>
    )
  }
}

export const HeroContainerBlock: React.FC<IHeroContainerBlockProps> = ({ id, hero }) => {
  useEffect(() => {
    Aos.init({
      // Global settings:
      // tslint:disable-next-line: max-line-length
      disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
      // tslint:disable-next-line: max-line-length
      startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // class applied after initialization
      animatedClassName: 'aos-animate', // class applied on animation
      useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
      disableMutationObserver: false, // disables automatic mutations' detections (advanced)
      debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
      throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

      // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
      offset: 40, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: 'ease', // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: true, // whether elements should animate out while scrolling past them
      // tslint:disable-next-line: max-line-length
      anchorPlacement: 'top-bottom' // defines which position of the element regarding to window should trigger the animation
    })
  }, [])

  const router = useRouter()

  // when content has loaded, scroll to the hash
  useEffect(() => {
    if (router.asPath.includes('#')) {
      const hash = router.asPath.split('#')[1]
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView(true)
      }
    }
  }, [router.asPath])

  return (
    <>
      {hero && hero.length
        ? hero.map((hero, index) => (
            <Container fluid key={index} id={hero.hash}>
              <Row className={`${index % 2 === 0 ? 'flex-lg-row-reverse' : ''} flex-wrap`}>
                <Col
                  xs={12}
                  lg={6}
                  className={`px-0 ${mapColourToBg(hero.colour)}`}
                  style={{ zIndex: '1' }}
                >
                  <div className={`${styles.parallaxSection}`}>
                    <div
                      className={`${styles.parallaxChildSection} d-flex justify-content-center align-items-center `}
                    >
                      {hero.styles ? (
                        <style>
                          {`.${hero.id}:before {
                            background-image: url(${hero?.backgroundImage?.url});
                          }
                          .${hero.id}:after {
                            background-image: url(${hero?.texture?.url});
                          }
                          ${hero.styles.replaceAll('{id}', hero.id)}`}
                        </style>
                      ) : null}
                      <ImageSection className={`${styles.imgContainer} ${hero.id} h-100`} />

                      <div
                        className={`${styles.gmSectionIcon}`}
                        data-aos='fade-up'
                        data-aos-delay='100'
                        data-aos-duration='1500'
                        data-aos-easing='ease-in-out'
                      >
                        {hero.icon && hero.icon.url ? (
                          <img
                            src={hero.icon.url}
                            // alt='core team icon'
                            width={hero.icon.width / 2}
                            height={hero.icon.height / 2}
                            className='img-fluid'
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs={12} lg={6} className='px-0'>
                  <TextSection
                    title=''
                    id='team'
                    className={`${styles.txtContainer} ${mapColourToBg(
                      hero.colour
                    )} p-3 p-md-5 d-flex align-items-center`}
                  >
                    <h1
                      data-aos='fade-right'
                      data-aos-delay='100'
                      data-aos-duration='1000'
                      className='display-3 mb-4'
                    >
                      {hero.title}
                    </h1>
                    <>
                      {hero.description && hero.description.html ? (
                        <CmsContent
                          data-aos='fade-right'
                          data-aos-delay='100'
                          data-aos-duration='1000'
                          content={hero.description.html}
                        />
                      ) : null}
                    </>

                    <HeroButton button={hero.button} />

                    <>
                      {hero.boxText && hero.boxText.html ? (
                        <div className='row justify-content-center'>
                          <div className='col-12'>
                            <div
                              className={`${styles.gmCalloutContainer}
                                  ${mapColourToBorder(
                                    hero.boxColour
                                  )} mb-5 d-flex  justify-content-center align-items-center
                                `}
                              data-aos='fade-down'
                              data-aos-delay='100'
                              data-aos-duration='1000'
                            >
                              <div className={`${styles.gmCallout} w-100 p-3 p-lg-4`}>
                                <CmsContent content={hero.boxText.html} />
                              </div>
                              <div className={`${styles.gmCallOutIcon}`}>
                                <img
                                  src={hero?.boxIcon?.url}
                                  alt='callout icon'
                                  width='91'
                                  height='91'
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  </TextSection>
                </Col>
              </Row>
            </Container>
          ))
        : null}
    </>
  )
}
