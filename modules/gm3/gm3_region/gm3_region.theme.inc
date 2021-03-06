<?php

/**
 * Region tools button
 */
function theme_gm3_region_button($variables){
  theme('gm3_beautytip', array(
    'selector' => '.gm3-tools-button[data-gm3-class="region"]',
    'text' => t('Click to enable selecting regions from the map.<br/>Add regions by clicking on the map, remove by right clicking on a highlighted region.<br/>The size of the region being selected is depended on your zoom level.  Zoom in to select smaller regions, zoom out to select larger ones, or click the "Selecting by..." text at the top of the map.')
  ));
  return '<div data-gm3-class="region" class="gm3-tools-button"><p>+ ' . t('Region') . '</p></div>';
}

/**
 * Themes for field types.
 */
function theme_gm3_region_region_text($variables){
  return array(
    '#markup' => t('Region: %region_id', array(
      '%region_id' => $variables['data']['region_id']
    ))
  );
}