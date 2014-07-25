$Content
$Form

<h2>Developer Notes</h2>
<p>There are two ways nested pages can be displayed: entirely inline, or as a preview a link to the actual page.</p>

<h3>Preview</h3>
<% loop $Children %>
  <article>
    <h4><a href="$Link"><% if $MenuTitle %>$MenuTitle<% else %>$Title<% end_if %></a></h4>
    <% if $Image %>
      $RenderRetinaImage($Image.ID, 150, null, $Title)
    <% end_if %>
    $Content.BigSummary(30)
  </article>
<% end_loop %>

<h3>Inline</h3>
<% loop $Children %>
  <article>
    <h4>$Title</h4>
    <% if $Image %>
      $RenderRetinaImage($Image.ID, 300, null, $Title)
    <% end_if %>
    $Content
  </article>
<% end_loop %>
