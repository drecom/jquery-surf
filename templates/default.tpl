{#template MAIN}
<ul class="ranking-list ranking-list-x">
 {#foreach $T.rankings as r}
  <li class="ranking-column">
  {#include rankcolumn root=$T.r}
  </li>
 {#/for}
</ul>
{#/template MAIN}

{#template rankcolumn}
<image src="{$T.profile_image}" alt="{$T.user_name}" height="100" width="100" />
<p>{$T.rank}位 {$T.user_name}</p>
{#/template rankcolumn}
